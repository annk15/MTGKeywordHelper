echo "Will peform a clean on the database"

cd ../docker

docker compose down
if [ $? != 0 ]; then
    echo "Failed to close docker compose container"
fi

rm -rdf ../data/*
if [ $? != 0 ]; then
    echo "Failed to the clean generated data"
    exit 1
fi

echo "Done, Artifacts was succesfully removed!"