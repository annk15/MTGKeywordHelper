#!/usr/bin/env pwsh

function Check-MySQL {
    docker exec mtg-keyword-helper-db mysqladmin ping -h "localhost" --silent
}

docker-compose up -d

Write-Host "Waiting for MySQL to be reachable..."
while (-not (Check-MySQL)) {
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 2
}

Write-Host "MySQL is reachable, will proceed with populating the database"

# Check if the venv directory exists
if (-not (Test-Path -Path "venv")) {
    Write-Host "venv directory does not exist. Creating virtual environment..."

    python3 -m venv venv
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Virtual environment created successfully."
    } else {
        Write-Host "Failed to create virtual environment."
        exit 1
    }
}

& "venv/Scripts/Activate.ps1"

pip install -r requirements.txt

python sync.py
