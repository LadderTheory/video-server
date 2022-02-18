. .env

docker-compose down
docker build -t $TITLE .
docker-compose up -d
docker-compose logs -f