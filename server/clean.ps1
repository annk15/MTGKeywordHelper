Write-Output "Will perform a clean on the server"

Remove-Item -Recurse -Force venv
if ($LASTEXITCODE -ne 0) {
    Write-Output "Failed to remove the python environment"
    exit 1
}

Write-Output "Done, Artifacts were successfully removed!"