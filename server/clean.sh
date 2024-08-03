echo "Will peform a clean on the server"

rm -rdf venv
if [ $? != 0 ]; then
    echo "Failed to remove the python environment"
    exit 1
fi

echo "Done, Artifacts was succesfully removed!"