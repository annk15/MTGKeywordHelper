#!/usr/bin/env pwsh

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

python server.py
