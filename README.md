# IoT HUB

IoT HUB provides simple HTTP interface to store any timeseries data in [InfluxDB](https://www.influxdata.com/).

## Prerequisities

You need to have `docker` and `docker-compose` installed on your machine. In most cases, if you work with IoT technlogy like SigFox you will need to have **public ip adress**

## Set up server
First create `.env` file  which defines variables `HTTP_PORT` and `HTTP_IP` on which the API runs. If you work with any IoT technology as SigFox, you need to use port with public access! Fire the `docker-compose build && docker-compose up` command to run the server. All the dependencies will be downloaded and installed in docker image - you do not have to install anything manually.
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
