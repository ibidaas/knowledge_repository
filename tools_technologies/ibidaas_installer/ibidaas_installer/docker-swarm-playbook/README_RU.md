# Автоматическое развертывание Docker Swarm кластера
Для развертывания устанавливается и используется Edge-версия Docker
Кластер разворачивается в конфигурации N-мастеров, N-воркеров
Хосты, которые уже участвуют в Swarm-кластерах не будут включены в обработку

## Требования к участникам кластера:
* CentOS \ RedHat
* Доступ в Интернет для YUM

## Требования к серверу развертывания:
* Ansible v2.4 (или новее)
* Jinja 2.9 (или новее)
* Ssh ключи должны быть скопированы на все серверы будущего кластера

## Запуск ANSIBLE-PLAYBOOK
```
$ sudo ansible-playbook ./swarm-cluster.yml
```
Доступен параметр http_proxy, для настройки прокси для docker
```
$ sudo ansible-playbook -e http_proxy=your-proxy-ip-or-name:your-port ./swarm-cluster.yml
```

Файл с настройками по умолчания
./ansible.cfg

Настройки по умолчанию:
* Список хостов (invertory-файл): "inventory = ./invertory.cfg" 
* Пользователь под которым выполняются команды на хостах: "remote_user = root"

## Документация по Docker Swarm
https://docs.docker.com/engine/swarm/swarm-tutorial