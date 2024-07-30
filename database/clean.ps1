Write-Output "Will perform a clean on the database"

docker compose down
if ($LASTEXITCODE -ne 0) {
    Write-Output "Failed to close docker compose container"
}

Remove-Item -Recurse -Force data\*
if ($LASTEXITCODE -ne 0) {
    Write-Output "Failed to clean the database data folder"
    exit 1
}

Remove-Item -Recurse -Force venv
if ($LASTEXITCODE -ne 0) {
    Write-Output "Failed to remove the python environment"
    exit 1
}

Write-Output "Done, Artifacts were successfully removed!"