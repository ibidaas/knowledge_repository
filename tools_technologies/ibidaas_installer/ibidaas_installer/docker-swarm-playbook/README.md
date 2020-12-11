# Auto deployment of Docker Swarm (multimanager) cluster (including docker installation)
Edge version of docker will be used for cluster deployment 

Docker cluster will be deployed with N-managers, N-workers

Hosts are used in swarm-cluster already will be skipped 


## Swarm hosts requirements:
* CentOS \ RedHat
* Internet connection (to get packages from repos)

## Ansible host requirements:
* Ansible v2.4 (or newer)
* Jinja 2.9 (or newer)
* Ssh-keys should be copied to all hosts of your invertory (ssh-copy-id can be used)

## Running ANSIBLE-PLAYBOOK
```
$ sudo ansible-playbook ./swarm-cluster.yml
```
http_proxy parameter is available, to setting up proxy for docker
```
$ sudo ansible-playbook -e http_proxy=your-proxy-ip-or-name:your-port ./swarm-cluster.yml
```

Default config file:
./ansible.cfg

Default settings:
* List of hosts (invertory-file): "inventory = ./invertory.cfg" 
* User on hosts: "remote_user = root"

## Official Docker Swarm documentation
https://docs.docker.com/engine/swarm/swarm-tutorial
