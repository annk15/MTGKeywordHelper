#!/bin/bash

# Check if the venv directory exists
if [ ! -d "venv" ]; then
  echo "venv directory does not exist. Creating virtual environment..."
  
  python3 -m venv venv
  if [ $? -eq 0 ]; then
    echo "Virtual environment created successfully."
  else
    echo "Failed to create virtual environment."
    exit 1
  fi
fi

source venv/bin/activate

pip install -r requirements.txt

python server.py

