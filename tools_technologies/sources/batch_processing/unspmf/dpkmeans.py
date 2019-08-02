'''
Created on Aug 2 2019
@author: Sukgamon Sukpisit, Srdjan Skrbic

Parallel Differential Privacy K-Means Clustering
We applied Laplacian mechanism proposed by Dwork in "A Firm Foundation for Private Data Analysis".
The laplacian noise will be added in updating centroids process.

'''

import numpy as np
from pycompss.api.api import compss_wait_on
from pycompss.api.parameter import INOUT
from pycompss.api.task import task
from scipy.sparse import csr_matrix
from sklearn.metrics import pairwise_distances


class DPKMeans:
    """ Perform Differential Privacy K-Means clustering. 

    Parameters
    ----------
    n_clusters : int, optional (default=8)
        The number of clusters.
    max_iter : int, optional (default=10)
        The specified max number of iterations in updating centroids.
    tol : float, optional (default=1e-4)
        Tolerance for accepting convergence.
    arity : int, optional (default=50)
        Arity of the reduction carried out during the computation of the new
        centroids.
    random_state : int or RandomState, optional (default=None)
        Seed or numpy.random.RandomState instance to generate random numbers
        for centroid initialization.
    verbose: boolean, optional (default=False)
        Whether to print progress information.
    epsilon: float, optional (default=0.1)
        The specified privacy budget used in Laplacian noise creations.

    Attributes
    ----------
    centers : ndarray
        Computed centroids.
    n_iter : int
        Number of iterations performed.

    """

    def __init__(self, n_clusters=8, max_iter=10, tol=1e-4, arity=50,
                 random_state=None, verbose=False, epsilon=0.1):
        self._n_clusters = n_clusters
        self._max_iter = max_iter
        self._tol = tol
        self._random_state = random_state
        self._arity = arity
        self.centers = None
        self.n_iter = 0
        self._verbose = verbose
        self._epsilon = epsilon
        self._numerator_noise = 0
        self._denomenator_noise = 0
        self._n_features = 0
        self._iter_count = 0

    def fit(self, dataset):
        """ Compute K-means clustering.

        Parameters
        ----------
        dataset : Dataset
            Samples to cluster.
        """
        self._do_fit(dataset, False)

    def fit_predict(self, dataset):
        """ Performs clustering on data, and sets the cluster labels of the
        input Dataset.

        Parameters
        ----------
        dataset : Dataset
            Samples to cluster.
        """

        self._do_fit(dataset, True)

    def predict(self, dataset):
        """ Predict the closest cluster each sample in dataset belongs to.
        Cluster labels are stored in dataset.

        Parameters
        ----------
        dataset : Dataset
            New data to predict.
        """
        for subset in dataset:
            _predict(subset, self.centers, dataset.sparse)

    def _do_fit(self, dataset, set_labels):
        n_features = dataset.n_features
        self._n_features = dataset.n_features
        sparse = dataset.sparse

        centers = _init_centers(n_features, sparse, self._n_clusters,
                                self._random_state)
        self.centers = compss_wait_on(centers)

        old_centers = None
        iteration = 0

        while not self._converged(old_centers, iteration, sparse):
            old_centers = self.centers.copy()
            partials = []

            for subset in dataset:
                partial = _partial_sum(subset, old_centers, set_labels, sparse)
                partials.append(partial)

            self._recompute_centers(partials)
            iteration += 1

        self.n_iter = iteration

    def _converged(self, old_centers, iteration, sparse):
        dist_f = _vec_euclid if not sparse else pairwise_distances

        if old_centers is not None:
            diff = 0

            for i, center in enumerate(self.centers):
                diff += dist_f(center, old_centers[i])

            if self._verbose:
                print("Iteration %s - Convergence crit. = %s"
                      % (iteration, diff))

            return diff < self._tol ** 2 or iteration >= self._max_iter

    def _laplace(self, b):
        return np.random.laplace(scale = b)

    def _recompute_centers(self, partials):
        while len(partials) > 1:
            partials_subset = partials[:self._arity]
            partials = partials[self._arity:]
            partials.append(_merge(*partials_subset))

        partials = compss_wait_on(partials)

        partial_epsilon = 0

        if self._epsilon == 0:
            self._numerator_noise = 0
            self._denomenator_noise = 0
        else:
            if self._iter_count == 0:
                self._numerator_noise = self._laplace((self._n_features + 1) / self._epsilon)
            else:
                self._numerator_noise = self._laplace((self._n_features + 1) / (self._epsilon / (self._iter_count * 2)))

            self._denomenator_noise = int(self._laplace(1 / self._epsilon))


        for idx, sum_ in enumerate(partials[0]):
            if sum_[1] != 0:
                self.centers[idx] = (sum_[0] + self._numerator_noise) / (sum_[1] + self._denomenator_noise)

        self._iter_count += 1


@task(returns=np.array)
def _get_label(subset):
    return subset.labels


@task(returns=np.array)
def _init_centers(n_features, sparse, n_clusters, random_state):
    np.random.seed(random_state)
    centers = np.random.random((n_clusters, n_features))

    if sparse:
        centers = csr_matrix(centers)

    return centers


@task(subset=INOUT, returns=np.array)
def _partial_sum(subset, centers, set_labels, sparse):
    partials = np.zeros((centers.shape[0], 2), dtype=object)
    dist_f = _vec_matrix_euclid if not sparse else pairwise_distances

    for idx, sample in enumerate(subset.samples):
        dist = dist_f(sample, centers)
        min_center = np.argmin(dist)

        if set_labels:
            subset.set_label(idx, min_center)

        partials[min_center][0] += sample
        partials[min_center][1] += 1

    return partials


@task(returns=dict)
def _merge(*data):
    accum = data[0].copy()

    for d in data[1:]:
        accum += d

    return accum


@task(subset=INOUT)
def _predict(subset, centers, sparse):
    dist_f = _vec_matrix_euclid if not sparse else pairwise_distances

    for sample_idx, sample in enumerate(subset.samples):
        dist = dist_f(sample, centers)
        label = np.argmin(dist)
        subset.set_label(sample_idx, label)


def _vec_matrix_euclid(vector, matrix):
    return np.linalg.norm(vector - matrix, axis=1)


def _vec_euclid(vec1, vec2):
    return np.linalg.norm(vec1 - vec2)
