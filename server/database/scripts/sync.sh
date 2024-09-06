#!/bin/bash

SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DOCKER_PATH=$SCRIPT_PATH/../docker
DATA_PATH=$SCRIPT_PATH/../data

function check_mysql {
    docker exec mtg-keyword-helper-db mysqladmin ping -h "localhost" --silent
}

cd $DATA_PATH && mkdir mysql && cd $SCRIPT_PATH
cd $DOCKER_PATH && docker compose up -d && cd $SCRIPT_PATH

echo "Waiting for MySQL to be reachable..."
while ! check_mysql; do
    echo -n "."
    sleep 2
done

echo "MySQL is reachable, will proceed with populating the database"

# Check if the venv directory exists
if [ ! -d "$DATA_PATH/venv" ]; then
  echo "venv directory does not exist. Creating virtual environment..."

  python3 -m venv $DATA_PATH/venv
  if [ $? -eq 0 ]; then
    echo "Virtual environment created successfully."
  else
    echo "Failed to create virtual environment."
    exit 1
  fi
fi

source $DATA_PATH/venv/bin/activate
pip install -r $SCRIPT_PATH/requirements.txt
python $SCRIPT_PATH/main.py