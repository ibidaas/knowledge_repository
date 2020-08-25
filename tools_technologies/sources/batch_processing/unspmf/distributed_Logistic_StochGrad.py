"""
Logistic regression, based on stochastic gradient descent

@Authors: Aleksandar Armacki and Lidija Fodor
@Affiliation: Faculty of Sciences, University of Novi Sad, Serbia

This work is supported by the I-BiDaaS project, funded by the European Commission under Grant Agreement No. 780787. 
"""
import numpy as np
import functools
import time
from numpy.random import binomial
import cvxpy as cp
import random
from numpy import float128
from pycompss.api.task import task
from pycompss.api.api import compss_wait_on
from pycompss.api.parameter import *

class Communication_Eff:

    """
    Fully distributed, stochastic gradient descent based solver.
    :param N: The number of workers used to solve the problem
    :param step: The step size for gradient descent
    :param probability: The probability for activity of workers
    """

    def __init__(self, N, step, probability):
        self.N = N
        self.step = step
        self.probability = probability

    @task(returns=np.array, targetDirection=IN)
    def gradient_compss(self, lmbd, samples, labels, x, activity):
        dim = samples.shape[1]
        grad = np.float128(np.zeros(dim))
        if(activity==1):
            dot = samples.dot(x)
            theVal = (-labels * samples.dot(x)).astype(np.float128)
            theExpVal =(np.exp(theVal)).astype(np.float128)
            ones = (np.ones(samples.shape[0])).astype(np.float128)      
            up = (theExpVal).astype(np.float128)
            down = (ones + theExpVal).astype(np.float128)
            fr = (up/down).astype(np.float128)
            fr[theVal>1000] = 1.0 
            fr[theVal<-1000] = 0.0
            frac = (labels*fr).astype(np.float128)
            fracDim = (frac[:, None]).astype(np.float128)
            theProduct = (fracDim * samples).astype(np.float128)
            theSum = (np.sum(theProduct, axis=0)).astype(np.float128)
            lmbdN=(lmbd / self.N)
            lmbdNx = (lmbdN * x)
            grad = (lmbdNx - theSum).astype(np.float128)
            return grad
        else:
            return grad

    @task(returns=np.array, targetDirection=IN)
    def update_x_local_compss(self, x_local1, grad, activity):
        dim = grad.shape[0]
        if (activity == 1):
            return x_local1 - self.step * grad
        else:
            return np.zeros(dim)

    def stepFunc(self, x_main, samples_chunk, labels_chunk, lmbd, k):
        activity = binomial(n = 1, p = 1 - self.probability **(k+1), size = self.N)
        x_local = list(x_main for i in range(self.N))
        dim = x_main.shape[0]
        if sum(activity) != 0:
            grad = list(map(functools.partial(self.gradient_compss, lmbd), samples_chunk, labels_chunk, x_local, activity))
            grad = compss_wait_on(grad)
            x_local = list(map(functools.partial(self.update_x_local_compss), x_local, grad, activity))
            x_local = compss_wait_on(x_local)
            x_main = np.asarray(x_local).reshape(self.N, dim).sum(axis=0) / sum(activity)

        return x_main

class LogisticRegression:
    """
    LogisticRegression represents the L2 regularized binary classification algorithm, solved in a distributed manner.
    :param N: The number of workers used to solve the problem
    :param max_iter: The maximum number of iterations before the algorithm stops automatically
    :param lmbd: The regularization parameter for Logistic regression

    """

    def __init__(self, N, lmbd, max_iter, optimizer):
        self.N = N
        self.lmbd = lmbd
        self.max_iter = max_iter
        self.optimizer = optimizer

    def fit(self):
        # file names
        rng = np.asarray(range(self.N))
        str_data = ["Sample" + str(i + 1) + ".dat" for i in rng]
        str_labels = ["Label" + str(i + 1) + ".dat" for i in rng]

        # reading the data
        data_chunk = list(map(self.read_data, str_data))
        data_chunk = compss_wait_on(data_chunk)

        label_chunk = list(map(self.read_labels, str_labels))
        label_chunk = compss_wait_on(label_chunk)

        # get the dimensions
        (part, n) = data_chunk[0].shape
        m = part * self.N


        # initialization
        x_main = np.zeros(n)
        k = 0

        for i in range(self.max_iter):
            optimizer = self.optimizer
            x_main = optimizer.stepFunc(x_main, data_chunk, label_chunk, self.lmbd, k)
            k += 1

        self.x_main = x_main
        return x_main

    def predict(self, data):
        labels = np.dot(data, self.x_main)
        labels = np.sign(labels)

        for i in range(len(labels)):
            if labels[i] == 0:
                labels[i] == random.choice([-1,1])

        return labels

    def fit_predict(self, data):
        self.fit()
        return self.predict(data)

    @task(fileName=FILE_IN, returns=np.array, targetDirection=IN)
    def read_data(self, file_name):
        # read samples, fileName="A"+str(i+1)+".dat"
        f = open(file_name, 'r')   
        line1 = f.readline()
        dims = list(map(int, line1.split()))
        res = np.asarray(dims)
        m = res[0]
        n = res[1]
        rest = f.read()
        vecl = list(map(float, rest.split()))
        vec = np.asarray(vecl)

        return vec.reshape(m, n)

    @task(fileName=FILE_IN, returns=np.array,  targetDirection=IN)
    def read_labels(self, file_name):
        # read labels, fileName="b"+str(i+1)+".dat"
        f = open(file_name, 'r')
        line1 = f.readline()
        dims = list(map(int, line1.split()))
        res = np.asarray(dims)
        m = res[0]
        n = res[1]
        rest = f.read()
        vecl = list(map(float, rest.split()))
        vec = np.asarray(vecl)

        return vec
