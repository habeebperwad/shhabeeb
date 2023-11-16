### - This application expects mongodb at 127.0.0.1:27017 with database transaction support.

### - If you don't have such a connection, use the following docker.

### - Standard mongodb doesn't support database transaction; should enable Repl Set.

## Docker for mongodb with RepicationSet:

1. Create mongodb docker image.

```
cd DockerfileMongodbReplset
docker build  -t mongodb:replset ./
```

2. Create a container for the image.

```
sudo docker run --name mongodb-replset -p 27017:27017 -d mongodb:replset
```

3. Test mongodb connection.

```
mongosh
```

3. Useful docker commands:

```
- docker image ls
- docker ps -a
- docker stop <container-id>
- docker start <container-id>
- docker rm "/mongodb-replset"
```
