# Known Problems

I would like to point out few bugs in the application. I hope I will be able to fix them as soon as possible.

## Initial Database Creation

> This error occurs during initial setup of your application - once you fix it, you do not have to care about it later.

I was unable to create default database `iot` (where the data is stored) during the first startup of the service. It is known [bug](https://github.com/influxdata/influxdata-docker/issues/232) of influxDB.

### Solution

Once you `docker-compose up`, run `CONTAINER_ID=$(docker ps --format "{{.ID}} {{.Image}}" | grep influx | awk '{print $1}')` which will save the influxdb container id to variable `CONTAINER_ID`. Now ssh into container and run influx client `docker exec -it ${CONTAINER_ID} influx`. Run `SHOW DATABASES`, if `iot` is present - you have already created it before, escape with `Ctrl+d`, you are done, problem solved. If `iot` is **not present** run `CREATE DATABASE iot`, problem should be solved.

## Grafana "The connection was reset"

Grafana starts too long, if you start the services and immediately go to its frontend `http://127.0.0.1:3000` you will receive `The connection was reset` error. Just wait for approximately one minute, then the frontend should be accesible.

# IoT HUB

IoT HUB provides simple HTTP interface to store any timeseries data in [InfluxDB](https://www.influxdata.com/).

## Prerequisities

You need to have `docker` and `docker-compose` installed on your machine. In most cases, if you work with IoT technlogy like SigFox you will need to have **public ip adress**.

## Set Server up

First create `.env` file which defines variables `HTTP_PORT` and `HTTP_IP` on which the API runs. If you work with any IoT technology as SigFox, you need to use port with public access! Fire the `docker-compose build && docker-compose up` command to run the server. All the dependencies will be downloaded and installed in docker image - you do not have to install anything manually.

```
HTTP_PORT=5000
HTTP_IP=127.0.0.1
```

## Save Data

Once the server runs, you can fire POST request to the `/api/` endpoint. I preffer using [postman](https://www.postman.com/) to make the requests, but the easiest way is to copy-paste bellow command and fire it in terminal (make sure you have [curl](https://curl.haxx.se/) installed)

```
curl --location --request POST 'http://127.0.0.1:5000/api' \
--header 'Content-Type: application/json' \
--data-raw '{
	"measurement": "device_id_test",
	"fields":{
		"temperature": 13,
		"huminidy": 10.16,
		"measurement_time": 100918403
	}
}'
```

The body (`--data-raw`) must be in format `{"measurement": "id_of_device", "fields": {...valuesToSave}}`. Error occurs if you will not include `measurement` or `fields` tag. The `fields` object must not include other objects! It can contain only key-value pairs of trivial datatypes (string, number, boolean). The following command should return `error code 400`

```
curl --location --request POST 'http://127.0.0.1:5000/api' \
--header 'Content-Type: application/json' \
--data-raw '{
	"measurement": "id_zarizeni_test",
	"fields":{
		"teplota": 13,
		"vlhkost": 10.16,
		"cas_mereni": 100918403,
		"necekany_objekt": {
			"oh": 1,
			"outstanding move": -1
		}
	}
}'
```

## Set Grafana up

After setting server up grafana runs by default on `http://127.0.0.1:3000`. Enter credentials `admin` (password and username) and change the password. Add datasource `InfluxDB`. Since application is in its own docker environment, **use `http://influxdb:8086` as URL** (do not use localhost or 127.0.0.1, it will not work). Then in InfluxDB Details setup `iot` as **Database**. Your connection to the database should work now.

Create new Dashboard with query `SELECT "temperature" FROM "device_id_test"`, if you have run command from **Save Data** section, you should see values from DB.
