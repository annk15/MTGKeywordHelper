#!/bin/bash

function check_mysql {
    docker exec mtg-keyword-helper-db mysqladmin ping -h "localhost" --silent
}

docker compose up -d

# Start Docker Compose
docker-compose up -d

# Wait for MySQL to be reachable
echo "Waiting for MySQL to be reachable..."
while ! check_mysql; do
    echo -n "."
    sleep 2
done

echo "MySQL is reachable, will proceed with populating the database"

# Check if the venv directory exists
if [ ! -d "venv" ]; then
  echo "venv directory does not exist. Creating virtual environment..."
  # Create the virtual environment using python3.12
  python3.12 -m venv venv
  if [ $? -eq 0 ]; then
    echo "Virtual environment created successfully."
  else
    echo "Failed to create virtual environment."
    exit 1
  fi
fi

source venv/bin/activate

pip install -r requirements.txt

python sync.py