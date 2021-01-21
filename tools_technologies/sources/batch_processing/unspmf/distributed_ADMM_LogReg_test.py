from LogRegADMM import ADMM
from LogRegADMM import LogisticRegression
from sklearn.linear_model import LogisticRegression as LogisticRegressioncv
import numpy as np
import time
import sys

def main():
    start = time.time()
    n = int(sys.argv[1])

    optimizer = ADMM(rho=1, abstol=1e-4, reltol=1e-2)
    logreg = LogisticRegression(n=n, max_iter=500, lmbd=1e-3, optimizer=optimizer)
    optimizer.objective_fn = logreg.objective_x

    z = logreg.fit()

    print("\nTotal elapsed time: %s" % str((time.time() - start) / 100))
    np.savetxt("Solution.COMPSs.txt", z)
    



if __name__ == '__main__':
    main()
