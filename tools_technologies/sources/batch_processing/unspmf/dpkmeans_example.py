import numpy as np

from sklearn.datasets import make_blobs
from dislib.cluster import KMeans
from dislib.data import load_data
from dpkmeans import DPKMeans

def main():
	import time

	# Sample configuration
	n_samples = 5000000
	n_features= 8
	subset_size = 500000
	random_state = 170

	# Clustering configuration
	K = 4
	epsilon = 0.1


	x, y = make_blobs(n_samples=n_samples, n_features=n_features, random_state=random_state)
	dataset = load_data(x, subset_size=subset_size)

	print("SAMPLES: ", n_samples)
	print("FEATURES: ", n_features)
	print("SUBSET DEFAULT SIZE: ", subset_size)

	startTime = time.time()
	py_time = 0

	dpkmeans = DPKMeans(n_clusters = K, random_state = random_state, epsilon = epsilon)
	dpkmeans.fit_predict(dataset)

	py_time += time.time() - startTime

	print("EPSILON: ", epsilon)
	print("K: ", K)
	print("PROCESSING TIME: ", py_time)
	print("DPKMeans clusters: ")
	print(dpkmeans.centers)

if __name__ == '__main__':
	main()
