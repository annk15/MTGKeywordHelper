echo "Will peform a clean on the database"

docker compose down
if [ $? != 0 ]; then
    echo "Failed to close docker compose container"
fi

rm -rdf data/*
if [ $? != 0 ]; then
    echo "Failed to the clean database data folder"
    exit 1
fi

rm -rdf venv
if [ $? != 0 ]; then
    echo "Failed to remove the python environment"
    exit 1
fi

echo "Done, Artifacts was succesfully removed!"