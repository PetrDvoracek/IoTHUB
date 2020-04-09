# IoT HUB

IoT HUB provides simple HTTP interface to store any timeseries data in [InfluxDB](https://www.influxdata.com/).

## Prerequisities

You need to have `docker` and `docker-compose` installed on your machine. In most cases, if you work with IoT technlogy like SigFox you will need to have **public ip adress**

## Set up server
First create `.env` file  which defines variables `HTTP_PORT` and `HTTP_IP` on which the API runs. If you work with any IoT technology as SigFox, you need to use port with public access! Fire the `docker-compose build && docker-compose up` command to run the server! All the dependencies will be downloaded and installed in docker image.
```
HTTP_PORT=5000
HTTP_IP=0.0.0.0
```
