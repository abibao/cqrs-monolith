#!/bin/sh

# script/ci-bootstrap-mysql - make sure all required dependencies are setup

# exit on sub-module failure
set -e

# move to parent dir
cd "$(dirname "$0")/.."

# ------

echo "Boostrapping build"
date "+%H:%M:%S"

echo "--------- "

# capture docker info for debug
docker info

echo "--------- "
echo "Stop if exists mysql"
docker stop deve_mysql || echo 'no container to stop'
echo "Remove if exists mysql"
docker rm deve_mysql || echo 'no container to delete'

echo "--------- "
echo "Setting up mysql"

# startup mysql
docker pull library/mysql:5
docker run -d --name deve_mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=none -d mysql:5

echo "--------- "

# capture docker process for debug
docker ps -a

echo "--------- "
echo "Waiting for mysql"

# wait for mysql to be ready
check_status() {
  OUTPUT="Can't connect"
  while [[ $OUTPUT == *"Can't connect"* ]]
  do
    OUTPUT=$(mysql -h localhost -P :3306 -u root --password=none < ./my_script.sql 2>&1)
    echo "Failed to connect to localhost:3306"
    sleep 1
  done
}
check_status

echo "--------- "
echo "Bootstrapping done!"
