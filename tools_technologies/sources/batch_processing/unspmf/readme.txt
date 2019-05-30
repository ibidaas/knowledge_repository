# Lasso ADMM implementation, relying on COMPSS framework

**Running - run as:**

enqueue_compss  --num_nodes=n --python_interpreter=python3.6 --worker_in_master_cpus=m --cpus_per_node=m --exec_time=300 distributed_Lasso_ADMM_*.py num

where n is the number of nodes used, m is the number of workers per node, num is the overall number of workers, instead of distributed_Lasso_ADMM_*.py, use the name of the appropriate source file

**Required software:**

- COMPSs framework installed on a HPC cluster
- Python3

**Required python packages:**
- numpy
- cvxpy
- scipy

**Implementations:**
- distributed_Lasso_ADMM.py - ADMM Lasso, relying on cvxpy
- distributed_Lasso_ADMM_warm_start.py- ADMM Lasso, relying on cvxpy, using warm start

**Reading data: ** 
- provide num (number of workers) files for matrix parts named A1.dat, A2.dat... and num files for vector named b1.dat, b2.dat. The first line in A1.dat, A2.dat... contains the dimensions of the data chunk e.g. p n. The first line in b1.dat, b2.dat... contains also the dimensions of the data chunk e.g. p 1. This means, that the dimension of the whole matrix is (p x num) x n, and the dimension of the whole vector is (p x num) x 1.

**Result: **
- the algorithm writes its solution to a .txt file
- it prints the execution time, required number of iterations

**Acknowledgement:**
- This implementation relies on cvxpy

**Reference:**
- <a href="https://web.stanford.edu/~boyd/papers/pdf/admm_distr_stats.pdf"> Distributed Optimization and StatisticalLearning via the Alternating DirectionMethod of Multipliers </a>
