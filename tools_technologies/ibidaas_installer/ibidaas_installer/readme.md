#I-BiDaas opensource installer

## Pre-Installation Requirements
One host running ansible V2.7 or higher, access (via SSH with public key authentication) to two or more centos nodes. A two-node installation will result in installing the software shown in Figure 1.

 

## Installation and Configuration Procedure
Auto deployment of Docker Swarm (multimanager) cluster (including docker installation)
- Edge version of docker will be used for cluster deployment 
- Docker cluster will be deployed with N-managers, N-workers
- Hosts are used in swarm-cluster already will be skipped 

Swarm hosts requirements:
- CentOS \ RedHat
- Internet connection (to get packages from repos)

Ansible host requirements:
- Ansible v2.4 (or newer)
- Jinja 2.9 (or newer)
- Ssh-keys should be copied to all hosts of your inventory (ssh-copy-id can be used)



Edit hosts file
In this file, we define the hosts to be used. An example configuration with one manager and two workers is the following:
manager ansible_ssh_host=192.168.15.100
worker1 ansible_ssh_host=192.168.15.101
worker2 ansible_ssh_host=192.168.15.102

[docker-swarm-manager]
manager

[docker-swarm-node]
worker1
worker2

[docker-swarm:children]
docker-swarm-manager
docker-swarm-node

Running ANSIBLE-PLAYBOOK
ansible-playbook -h hosts playbook swarm-cluster.yml
ansible-playbook -h hosts playbook site.yml
ansible-playbook -h hosts playbook manager.yml
