"""
ADMM Ridge

@Authors: Aleksandar Armacki and Lidija Fodor
@Affiliation: Faculty of Sciences, University of Novi Sad, Serbia

This work is supported by the I-BiDaaS project, funded by the European Commission under Grant Agreement No. 780787. 
"""

import numpy as np
import cvxpy as cp
import functools
import time
import sys
from pycompss.api.task import task
from pycompss.api.api import compss_wait_on
from pycompss.api.parameter import *


class ADMM:
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

    def __init__(self, rho=1, abstol=1e-4, reltol=1e-2, warm_start=False, objective_fn=None, objective_z=None):
        self.rho = rho
        self.abstol = abstol
        self.reltol = reltol
        self.warm_start = warm_start
        self.objective_fn = objective_fn
        self.objective_z = objective_z

    @task(returns=np.array)
    def x_update(self, z, rho, a, b, u):
        n = a.shape[1]
        sol = cp.Variable(n)
        problem = cp.Problem(cp.Minimize(self.objective_fn(a, b, sol, z, u, rho)))
        problem.solve(warm_start=self.warm_start)
        return sol.value

    def z_update(self, x, u, rho):
        n = x.shape[0]
        sol = cp.Variable(n)
        problem = cp.Problem(cp.Minimize(self.objective_z(sol, x, u, rho)))
        problem.solve(warm_start=self.warm_start)
        return sol.value

    def step(self, z, data_chunk, target_chunk, u, z_old, i, n, N):
        # update x
        x = list(
            map(functools.partial(self.x_update, z, self.rho), data_chunk, target_chunk, u))
        x = compss_wait_on(x)

        # update z
        z = self.z_update(np.mean(x, axis=0), np.mean(u, axis=0), self.rho)

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
            return x, z, u, True

        return x, z, u, False


    @task(returns=np.array)
    def u_update(self, z, u, x):
        return u + x - z


class Ridge:
    """Ridge (or Tikhonov) regression represents the L2 regualarized linear model for
    regression analysis, solved in a distributed manner.

    :param n: The number of agents used to solve the problem
    :param max_iter: The maximum number of iterations before the algorithm stops automatically
    :param lmbd: The regularization parameter for Ridge regression

    """

    def __init__(self, n, max_iter=500, lmbd=1e-3, optimizer=None):
        self.N = n
        self.max_iter = max_iter
        self.lmbd = lmbd
        self.optimizer = optimizer

    def fit(self):

        # file names
        rng = np.asarray(range(self.N))
        str_a = ["A" + str(i + 1) + ".dat" for i in rng]
        str_b = ["b" + str(i + 1) + ".dat" for i in rng]

        # reading the data
        data_chunk = list(map(self.read_a_data, str_a))
        data_chunk = compss_wait_on(data_chunk)
        target_chunk = list(map(self.read_b_data, str_b))
        target_chunk = compss_wait_on(target_chunk)

        # get the dimensions
        (part, n) = data_chunk[0].shape
        m = part * self.N

        # initialization
        x = [np.zeros(n) for i in range(self.N)]
        z = np.zeros(n)
        z_old = np.zeros(n)
        u = [np.zeros(n) for _ in range(self.N)]

        req_iter = self.max_iter

        for i in range(self.max_iter):
            x, z, u, should_stop = \
                self.optimizer.step(z, data_chunk, target_chunk, u, z_old, i, n, self.N)

            if should_stop:
                break

            z_old = z

        self.z = z
        return z
        
    def predict(self, x):
        return np.dot(x, self.z)
        
    def fit_predict(self, x):
        self.fit()
        return self.predict(x)


    def loss_fn(self, a, b, x):
        return 1 / 2 * cp.norm(cp.matmul(a, x) - b, p=2) ** 2

    def regularizer_x(self, x, z, u):
        return cp.norm(x - z + u, p=2) ** 2

    def objective_x(self, a, b, x, z, u, rho):
        return self.loss_fn(a, b, x) + rho / 2 * self.regularizer_x(x, z, u)

    def objective_z(self,z, x, u, rho):
        return self.lmbd * cp.norm(z, p=2)**2 + 0.5*self.N*rho*cp.norm(x - z + u, p=2)**2

    @task(fileName=FILE_IN, returns=np.array)
    def read_a_data(self, file_name):
        # read matrix A, fileName="A"+str(i+1)+".dat"
        f = open(file_name, 'r')
        line1 = f.readline()
        dims = list(map(int, line1.split()))
        res = np.asarray(dims)
        m = res[0]
        n = res[1]
        rest = f.read()
        vecl = list(map(float, rest.split()))
        vec = np.asarray(vecl)

        return vec.reshape(n, m).T

    @task(fileName=FILE_IN, returns=np.array)
    def read_b_data(self, file_name):
        # read vector b, fileName="b"+str(i+1)+".dat"
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


def main():
    start = time.time()
    n = int(sys.argv[1])

    optimizer = ADMM(rho=1, abstol=1e-4, reltol=1e-2)
    ridge = Ridge(n=n, max_iter=500, lmbd=1e-3, optimizer=optimizer)
    optimizer.objective_fn = ridge.objective_x
    optimizer.objective_z = ridge.objective_z

    z = ridge.fit()

    print("\nTotal elapsed time: %s" % str((time.time() - start) / 100))
    np.savetxt("Solution.COMPSs.txt", z)
    
    print(ridge.predict(np.random.rand(50, 50)))

if __name__ == '__main__':
    main()
