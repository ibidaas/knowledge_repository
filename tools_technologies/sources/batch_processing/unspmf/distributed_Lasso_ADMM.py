"""
ADMM Lasso

@Authors: Aleksandar Armacki and Lidija Fodor
@Affiliation: Faculty of Sciences, University of Novi Sad, Serbia

This work is supported by the I-BiDaaS project, funded by the European Commission under Grant Agreement No. 780787. 
"""

import numpy as np
from numpy.linalg import cholesky
from scipy.linalg import solve_triangular
import cvxpy as cp
import functools
import time
import sys
from pycompss.api.task import task
from pycompss.api.api import compss_wait_on
from pycompss.api.parameter import *


def admm_lasso(N = 10, max_iter = 500, lmbd = 1e-3, rho = 1, abstol = 1e-4, reltol = 1e-2):

    """ADMM Lasso represents the Least Absolute Shrinkage and Selection Operator (Lasso) for 
    regression analysis, solved in a distributed manner. It relies on the Alternating Direction Method
    of Multipliers (ADMM) as the solver. ADMM is renowned for being well suited to the distributed
    settings, for its guaranteed convergence and general robustness with respect to the parameters. 
    Additionally, the algorithm has a generic form that can be easily adapted to a wide range of 
    machine learning problems with only minor tweaks in the code.

    :param N: The number of agents used to solve the problem
    :param max_iter: The maximum number of iterations before the algorithm stops automatically
    :param lmbd: The regularization parameter for Lasso regression
    :param rho: The penalty parameter for constraint violation in ADMM
    :param abstol: The absolute tolerance used to calculate the early stoppage criterion for ADMM
    :param reltol: The relative tolerance used to calculate the early stoppage criterion for ADMM
    """
    

    #file names
    rng = np.asarray(range(N))
    strA = ["A"+str(i+1)+".dat" for i in rng]
    strb = ["b"+str(i+1)+".dat" for i in rng]

    #reading the data
    data_chunk = list(map(readAData, strA))
    data_chunk = compss_wait_on(data_chunk)
    target_chunk = list(map(readbData, strb))
    target_chunk = compss_wait_on(target_chunk)

    #get the dimensions
    (part, n) = data_chunk[0].shape
    m = part*N

    #initialization
    x = [np.zeros(n) for i in range(N)]
    z = np.zeros(n)
    z_old = np.zeros(n)
    u = [np.zeros(n) for i in range(N)]

    req_iter = max_iter
    frac = lmbd / rho

    for i in range(max_iter):
        #update x
        x = list(map(functools.partial(x_update, z,  rho), data_chunk, target_chunk, u))
        x = compss_wait_on(x)

        #update z
        z = soft_thr(np.mean(x, axis = 0) + np.mean(u, axis = 0), frac)

        #update u
        u = list(map(functools.partial(u_update, z), x, u))
        u = compss_wait_on(u)
        
       	nxstack = np.sqrt(np.sum(np.linalg.norm(x, axis=1) ** 2))
        nystack = np.sqrt(np.sum(np.linalg.norm(u, axis=1) ** 2))

        #termination check
        dualres = np.sqrt(N) * rho * np.linalg.norm(z - z_old)
        prires = np.sqrt(np.sum(np.linalg.norm(np.array(x) - z_old, axis=1) ** 2))

        eps_pri = (np.sqrt(N * n)) * abstol + reltol * (max(nxstack, np.sqrt(N) * np.linalg.norm(z)))
        eps_dual = np.sqrt(N * n) * abstol + reltol * nystack

        if prires <= eps_pri and dualres <= eps_dual:
            req_iter = i
            break

        z_old = z

    return z


def soft_thr(v,k):
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

def loss_fn(A, b, x):
    return 1/2*cp.norm(cp.matmul(A, x) - b, p=2)**2

def regularizer_x(x, z, u):
    return cp.norm(x - z + u, p=2)**2

def objective_x(A, b, x, z, u, rho):
    return loss_fn(A, b, x) + rho/2 * regularizer_x(x, z, u)

@task(returns=np.array)
def x_update(z, rho, A, b, u):
    n = A.shape[1]
    sol = cp.Variable(n)
    problem = cp.Problem(cp.Minimize(objective_x(A, b, sol, z, u, rho)))
    problem.solve()
    return sol.value

@task(returns=np.array)
def u_update(z,u,x):
    return u + x - z

@task(fileName=FILE_IN, returns=np.array)
def readAData(fileName):
    #read matrix A, fileName="A"+str(i+1)+".dat"
    f=open(fileName, 'r')
    line1=f.readline()
    dims=list(map(int, line1.split()))
    res=np.asarray(dims)
    m=res[0]
    n=res[1]
    rest=f.read()
    vecl = list(map(float, rest.split()))
    vec=np.asarray(vecl)
    
    return vec.reshape(n,m).T

@task(fileName=FILE_IN, returns=np.array)
def readbData(fileName):
    #read vector b, fileName="b"+str(i+1)+".dat"
    f=open(fileName, 'r')
    line1=f.readline()
    dims=list(map(int, line1.split()))
    res=np.asarray(dims)
    m=res[0]
    n=res[1]
    rest=f.read()
    vecl = list(map(float, rest.split()))
    vec=np.asarray(vecl)
    return vec

def main():
        start = time.time()
        N = int(sys.argv[1])	
        lmbd = 0.005
        z = lasso(N, max_iter = 500, lmbd = 1e-3, rho = 1, abstol = 1e-4, reltol = 1e-2)

        print("\nTotal elapsed time: %s" % str((time.time() - start)/100))
        np.savetxt("Solution.COMPSs.txt", z)    

if __name__ == '__main__':
    main()


