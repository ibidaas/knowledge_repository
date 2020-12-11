import numpy as np
import cvxpy as cp
from sklearn.datasets.samples_generator import make_blobs
import functools
import time
import sys
from pycompss.api.task import task
from pycompss.api.api import compss_wait_on
from pycompss.api.parameter import *

""" To be fully tested """

def admm_kmeans(workers=10, num_iter=100, lmbd=0.1, rho=1):

    """ADMM kmeans represents an adapted kmeans implementation, based on the idea of SON (sum of norms) clustering, 
    but solving the problem in a distributed manner. It relies on the Alternating Direction Method
    of Multipliers (ADMM) as the solver. ADMM is renowned for being well suited to the distributed
    settings, for its guaranteed convergence and general robustness with respect to the parameters. 
    
    :param workers: The number of agents used to solve the problem
    :param num_iter: The maximum number of iterations before the algorithm stops automatically
    :param lmbd: The regularization parameter
    :param rho: The penalty parameter for constraint violation in ADMM
    """
    A = load_data()
    
    N = A.shape[0]
    d = A.shape[1]
    chunk_size = N // workers
    a = [A[i*chunk_size:(i+1)*chunk_size] for i in range(workers)]

    x = [np.zeros((chunk_size, d)) for i in range(workers)]
    y = [np.zeros((d)) for i in range(workers-1)]
    y = np.asarray(y)
    lambdaVal = [np.zeros((d)) for i in range(workers-1)]

    for i in range(num_iter):
      x[0] = update_x_zero(a[0], x[0], y, lmbd, workers)
      x[1:workers] = list(map(functools.partial(update_x, rho,  lmbd, d), a[1:workers], x[1:workers], y, lambdaVal))
      x[1:workers] = compss_wait_on(x[1:workers])
      y = y_update(lambdaVal, x, y, rho, workers-1, d)
      lambdaVal = lambda_update(lambdaVal, rho, x, y, workers-1)

    return x, y

def load_data():
    #Generate some data for testing, change this to load your actual data
    N = 30000
    d = 2
    A, y_true = make_blobs(n_samples=N, centers=3, cluster_std=0.60, random_state=0, n_features=d)
    return A

def loss_x1(A,x):
    return cp.sum_squares(cp.norm(A - x, p=2, axis=1))

def loss_x2(x, lmbd):
    local_n = x.shape[0]
    sumOfNorms = cp.sum([cp.norm(x[i]-x[0], p=2, axis=0) for i in range(1, local_n)])
    return lmbd * sumOfNorms

def loss_x3(x, y, lambdaVal, d):
    diff = y-x[0]
    return (cp.reshape(lambdaVal, (d,1))).T @ cp.reshape(diff, (d,1))

def loss_x4(x, y, rho):
    norm = cp.norm(y-x[0], p=2, axis=0)
    return 1/2 * rho * cp.square(norm)

def loss_x_zero(x, y, lmbd, workers):
    sumOfNorms = cp.sum([cp.norm(x[0]-y[i-1], p=2) for i in range(1, workers)])
    return lmbd * sumOfNorms

def objective_x(a, x, lambdaVal, y, rho, lmbd, d):
    return loss_x1(a, x) + loss_x2(x, lmbd) + loss_x3(x,y,lambdaVal, d) + loss_x4(x, y, rho)

def objective_x_zero(a, x, y, lmbd, workers):
    return loss_x1(a, x) + loss_x2(x, lmbd) + loss_x_zero(x, y, lmbd, workers)

def loss_y1(lambdaVal, x, y, workers, d):
    val = cp.sum([(cp.reshape(lambdaVal[i],(d, 1))).T @ cp.reshape(y[i]-x[i+1][0], (d,1)) for i in range(0, workers)])
    return 1

def loss_y2(rho, x, y, workers):
    val = 1/2 * rho * cp.sum([cp.square(cp.norm(y[i]-x[i+1][0], p=2, axis=0)) for i in range(0, workers)])
    return val

def objective_y(lambdaVal, x, y, rho, workers, d):
    return loss_y1(lambdaVal, x, y, workers, d) + loss_y2(rho, x, y, workers) 

@task(returns=np.array)
def update_x(rho, lmbd, d, a, x, y, lambdaVal):
    sol = cp.Variable(a.shape)
    problem = cp.Problem(cp.Minimize(objective_x(a, sol, lambdaVal, y, rho, lmbd, d)))
    problem.solve()
    return sol.value

def y_update(lambdaVal, x, y, rho, workers, dim):  
    sol = cp.Variable(y.shape)
    problem = cp.Problem(cp.Minimize(objective_y(lambdaVal, x, sol, rho, workers, dim)))
    problem.solve()
    return sol.value

def lambda_update(lambdaVal, rho, x, y, workers):
    for i in range(0, workers):
    	lambdaVal[i] = (lambdaVal[i]+ rho * (y[i]-x[i+1][0]))
    return lambdaVal
    
def update_x_zero(a, x, y, lmbd, workers):
    sol=cp.Variable(a.shape)
    problem = cp.Problem(cp.Minimize(objective_x_zero(a, sol, y, lmbd, workers)))
    problem.solve()
    return sol.value

def main():

    A=load_data()
    start = time.time()
    workers = int(sys.argv[1])	
    x, y = admm_kmeans(workers+1, num_iter=100, lmbd=0.1, rho=1)

    print("\nTotal elapsed time: %s" % str((time.time() - start)/100))
    x_rs = []
    for i in range(workers):
      x_rs.append(x[i][0])    
    np.savetxt("Solution_x.COMPSs.txt", x_rs)
    np.savetxt("Solution_y.COMSs.txt",y) 

if __name__ == '__main__':
    main()
