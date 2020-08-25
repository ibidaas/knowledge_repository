"""
Parallel differentially private random forest

@Authors: Sukgamon Sukpisit and Srdjan Skrbic
@Affiliation: Faculty of Sciences, University of Novi Sad, Serbia

This work is supported by the I-BiDaaS project, funded by the European Commission under Grant Agreement No. 780787. 
"""

import math
from collections import Counter

import numpy as np
from pycompss.api.api import compss_wait_on
from pycompss.api.parameter import INOUT
from pycompss.api.task import task
from sklearn.utils import check_random_state

from data import Dataset
from rfdata import RfDataset, transform_to_rf_dataset
from dptree import DPDecisionTree

class DPRandomForest:
"""
	Perform Differential privacy random forest

	Parameters
	----------
	n_estimators: int, optional (default=1)
		the number of trees in the forest
	try_features: {None, 'sqrt', 'third', int}, optional (default='sqrt')
		The number of features to consider when looking for the best split
	max_depth: int, optional (default=np.inf)
		maximum alowed depth of the tree
	distr_depth:{'auto', int}, optional (default='auto')
		The number of features to consider when looking for the best split
	sklearn_max: float, optional (default=1e8)
	privacy_budget: float, optional (default=0.1)
		privacy budget, controlling the level of privacy
	bootstrap: boolean, optional (default=False)
		enable/disable bootstrapping
	random_state: {None, int, instance of RandomState}, optional (default=None)
		initializing the random state
	hard_vote: boolean, optional (default: False)
		enable/disable hard vote

	"""
	def __init__(self,
                 n_estimators=1,
                 try_features='sqrt',
                 max_depth=np.inf,
                 distr_depth='auto',
                 sklearn_max=1e8,
                 privacy_budget=0.1,
                 bootstrap=False,
                 random_state=None,
                 hard_vote=False):

		self.n_estimators = n_estimators
		self.try_features_init = try_features
		self.max_depth = max_depth
		self.distr_depth_init = distr_depth
		self.privacy_budget = privacy_budget
		self.bootstrap = bootstrap
		self.random_state = check_random_state(random_state)
		self.sklearn_max = sklearn_max
		self.hard_vote = hard_vote


	'''Done'''
	def fit(self, dataset, feature_types):

		self.classes = None
		self.trees = []

		if not isinstance(dataset, (Dataset, RfDataset)):
			raise TypeError('Invalid type for param dataset.')
		if isinstance(dataset, Dataset):
			dataset = transform_to_rf_dataset(dataset)

		if isinstance(dataset.features_path, str):
			dataset.validate_features_file()

		n_features = dataset.get_n_features()
		self.try_features = _resolve_try_features(self.try_features_init, n_features)

		self.classes = dataset.get_classes()

		if self.distr_depth_init == 'auto':
			dataset.n_samples = compss_wait_on(dataset.get_n_samples())
			self.distr_depth = max(0, int(math.log10(dataset.n_samples)) - 4)
			self.distr_depth = min(self.distr_depth, self.max_depth)
		else:
			self.distr_depth = self.distr_depth_init


		for i in range(self.n_estimators):
			tree = DPDecisionTree(
				self.try_features, 
				self.max_depth, 
				self.distr_depth, 
				self.sklearn_max,
				self.privacy_budget, 
				self.bootstrap,
				self.random_state)

			self.trees.append(tree)

		for tree in self.trees:
			tree.fit(dataset, feature_types)


	def predict(self, dataset):

		assert self.trees is not None, 'The random forest is not fitted.'


		if self.hard_vote:

			for subset in dataset:
				tree_predictions = []

				for tree in self.trees:
					tree_predictions.append(tree.predict(subset))

				_hard_vote(subset, self.classes, *tree_predictions)

		else:

			for subset in dataset:
				tree_predictions = []

				for tree in self.trees:
					tree_predictions.append(tree.predict_proba(subset))

				_soft_vote(subset, self.classes, *tree_predictions)


	def score(self, dataset):
		assert self.trees is not None, 'The random forest is not fitted.'

		partial_scores = []

		# for subset in dataset:
		# 	tree_predictions = []

		# 	for tree in self.trees:
		# 		tree_predictions.append(tree.predict(subset))

		# 	subset_score = _hard_vote_score(subset, self.classes, *tree_predictions)
		# 	partial_scores.append(subset_score)

		if self.hard_vote:
			for subset in dataset:
				tree_predictions = []

				for tree in self.trees:
					tree_predictions.append(tree.predict(subset))

				subset_score = _hard_vote_score(subset, self.classes, *tree_predictions)
				partial_scores.append(subset_score)
		else:
			for subset in dataset:
				tree_predictions = []

				for tree in self.trees:
					tree_predictions.append(tree.predict_proba(subset))

				subset_score = _soft_vote_score(subset, self.classes, *tree_predictions)
				partial_scores.append(subset_score)
				

		score = compss_wait_on(_merge_scores(*partial_scores))

		return score


@task(returns=1)
def _resolve_try_features(try_features, n_features):
	if try_features is None:
		return n_features
	elif try_features == 'sqrt':
		return int(math.sqrt(n_features))
	elif try_features == 'third':
		return max(1, n_features // 3)
	else:
		return int(try_features)


@task(subset=INOUT)
def _hard_vote(subset, classes, *predictions):
	mode = np.empty((len(predictions[0]),), dtype=int)
	for sample_i, votes in enumerate(zip(*predictions)):
		mode[sample_i] = Counter(votes).most_common(1)[0][0]
	subset.labels = classes[mode]


@task(subset=INOUT)
def _soft_vote(subset, classes, *predictions):
	aggregate = predictions[0]
	for p in predictions[1:]:
		aggregate += p
	subset.labels = classes[np.argmax(aggregate, axis=1)]


@task(returns=1)
def _hard_vote_score(subset, classes, *predictions):
	mode = np.empty((len(predictions[0]),), dtype=int)

	for sample_i, votes in enumerate(zip(*predictions)):
		mode[sample_i] = Counter(votes).most_common(1)[0][0]

	predicted_labels = classes[mode]
	real_labels = subset.labels
	correct = np.count_nonzero(predicted_labels == real_labels)

	return correct, len(real_labels)


@task(returns=1)
def _soft_vote_score(subset, classes, *predictions):
	aggregate = predictions[0]
	for p in predictions[1:]:
		aggregate += p
	predicted_labels = classes[np.argmax(aggregate, axis=1)]
	real_labels = subset.labels
	correct = np.count_nonzero(predicted_labels == real_labels)
	return correct, len(real_labels)


@task(returns=1)
def _merge_scores(*partial_scores):
	correct = sum(subset_score[0] for subset_score in partial_scores)
	total = sum(subset_score[1] for subset_score in partial_scores)

	return correct / total
