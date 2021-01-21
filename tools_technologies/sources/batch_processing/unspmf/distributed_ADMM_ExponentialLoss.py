"""
ADMM Exponential loss

This work is supported by the I-BiDaaS project, funded by the European Commission under Grant Agreement No. 780787. 
"""

""" To be fully tested """

import numpy as np
import cvxpy as cp
import functools
import time
import sys
import random
from pycompss.api.task import task
from pycompss.api.api import compss_wait_on
from pycompss.api.parameter import *


class ADMM(object):
    """
    Alternating Direction Method of Multipliers (ADMM) solver. ADMM is renowned for being well suited
    to the distributed settings, for its guaranteed convergence and general robustness with respect
    to the parameters. Additionally, the algorithm has a generic form that can be easily adapted to a
    wide range of machine learning problems with only minor tweaks in the code.
    :param rho: The penalty parameter for constraint violation in ADMM
    :param abstol: The absolute tolerance used to calculate the early stoppage criterion for ADMM
    :param reltol: The relative tolerance used to calculate the early stoppage criterion for ADMM
    :param warm_start: cvxpy warm start option
    :param objective_fn: objective function
    """

    def __init__(self, rho=1, abstol=1e-4, reltol=1e-2, warm_start=False, objective_fn=None):
        self.rho = rho
        self.abstol = abstol
        self.reltol = reltol
        self.warm_start = warm_start
        self.objective_fn = objective_fn

    @task(returns=np.array, target_direction=IN)
    def x_update(self, z, rho, a, b, u):
        n = a.shape[1]
        sol = cp.Variable(n)
        problem = cp.Problem(cp.Minimize(self.objective_fn(a, b, sol, z, u, rho)))
        problem.solve(warm_start=self.warm_start)
        return sol.value

    def soft_thr(self, v, k):
        z = np.zeros(v.shape)
        for i in range(z.shape[0]):
            if np.abs(v[i]) <= k:
                z[i] = 0
            else:
                if v[i] > k:
                    z[i] = v[i] - k
                else:
                    z[i] = v[i] + k
        return z

    def step(self, z, data_chunk, target_chunk, u, frac, z_old, i, n, N):
        # update x
        x = list(
            map(functools.partial(self.x_update, z, self.rho), data_chunk, target_chunk, u))
        x = compss_wait_on(x)

        # update z
        z = self.soft_thr(np.mean(x, axis=0) + np.mean(u, axis=0), frac)

        # update u
        u = list(map(functools.partial(self.u_update, z), x, u))
        u = compss_wait_on(u)

        nxstack = np.sqrt(np.sum(np.linalg.norm(x, axis=1) ** 2))
        nystack = np.sqrt(np.sum(np.linalg.norm(u, axis=1) ** 2))

        # termination check
        dualres = np.sqrt(N) * self.rho * np.linalg.norm(z - z_old)
        prires = np.sqrt(np.sum(np.linalg.norm(np.array(x) - z_old, axis=1) ** 2))

        eps_pri = (np.sqrt(N * n)) * self.abstol + self.reltol * \
                  (max(nxstack, np.sqrt(N) * np.linalg.norm(z)))
        eps_dual = np.sqrt(N * n) * self.abstol + self.reltol * nystack

        if prires <= eps_pri and dualres <= eps_dual:
            req_iter = i
            print("Required number of iterations ")
            print(req_iter)
            return x, z, u, True

        return x, z, u, False


    @task(returns=np.array, target_direction=IN)
    def u_update(self, z, u, x):
        return u + x - z


class ExponentialLoss(object):
    """Exponential loss
    solved in a distributed manner.

    :param n: The number of agents used to solve the problem
    :param max_iter: The maximum number of iterations before the algorithm stops automatically
    :param lmbd: The regularization parameter for Lasso regression

    """

    def __init__(self, n, max_iter=500, lmbd=1e-3, optimizer=None):
        self.N = n
        self.max_iter = max_iter
        self.lmbd = lmbd
        self.optimizer = optimizer

    def fit(self):

        aTime = time.time()
        # file names
        rng = np.asarray(range(self.N))
        str_a = ["Sample" + str(i + 1) + ".dat" for i in rng]
        str_b = ["Label" + str(i + 1) + ".dat" for i in rng]

        # reading the data
        data_chunk = list(map(self.read_a_data, str_a))
        data_chunk = compss_wait_on(data_chunk)
        target_chunk = list(map(self.read_b_data, str_b))
        target_chunk = compss_wait_on(target_chunk)

        bTime = time.time()
      
        print("The data was read")
        print("\ntime for reading the data is: %s" % str((bTime-aTime) / 100))


        # get the dimensions
        (part, n) = data_chunk[0].shape
        m = part * self.N

        print("The dimensions of each sample part are ")
        print(part)
        print(n)

        print("The overall dimension of sample is ")
        print(m)

        a =target_chunk[0].shape
        print("The dimension of labels is")
        print(a)

        # initialization
        x = [np.zeros(n) for i in range(self.N)]
        z = np.zeros(n)
        z_old = np.zeros(n)
        u = [np.zeros(n) for _ in range(self.N)]

        req_iter = self.max_iter
        frac = self.lmbd / self.optimizer.rho / self.N

        for i in range(self.max_iter):
            print(i)
            #cTime = time.time()
            x, z, u, should_stop = \
                self.optimizer.step(z, data_chunk, target_chunk, u, frac, z_old, i, n, self.N)
            #dTime = time.time()
            #print("\ntime for one step is: %s" % str((dTime-cTime) / 100))
            if should_stop:
                break

            z_old = z

        self.z = z
        return z
        
    def predict(self, data):
        labels = np.dot(data, self.z)
        labels = np.sign(labels)

        for i in range(len(labels)):
            if labels[i] == 0:
                labels[i] == random.choice([-1,1])

        return labels

    def fit_predict(self, x):
        self.fit()
        return self.predict(x)

    def loss_fn(self, a, b, x):
        return cp.exp((-b*(a @ x)))

    def regularizer_x(self, x, z, u):
        return cp.norm(x - z + u, p=2) ** 2

    def objective_x(self, a, b, x, z, u, rho):
        return self.loss_fn(a, b, x) + rho / 2 * self.regularizer_x(x, z, u)

    @task(fileName=FILE_IN, returns=np.array, target_direction=IN)
    def read_a_data(self, file_name):
        # read matrix A, fileName="A"+str(i+1)+".dat"
        f = open("/home/lidija/ADMMLogReg/"+file_name, 'r')
        #f = open(file_name, 'r')
        line1 = f.readline()
        dims = list(map(int, line1.split()))
        res = np.asarray(dims)
        m = res[0]
        n = res[1]
        rest = f.read()
        vecl = list(map(float, rest.split()))
        vec = np.asarray(vecl)

        return vec.reshape(m, n)

    @task(fileName=FILE_IN, returns=np.array, target_direction=IN)
    def read_b_data(self, file_name):
        # read vector b, fileName="b"+str(i+1)+".dat"
        f = open("/home/lidija/ADMMLogReg/"+file_name, 'r')
        #f = open(file_name, 'r')
        line1 = f.readline()
        dims = list(map(int, line1.split()))
        res = np.asarray(dims)
        m = res[0]
        n = res[1]
        rest = f.read()
        vecl = list(map(float, rest.split()))
        vec = np.asarray(vecl)
        return vec


