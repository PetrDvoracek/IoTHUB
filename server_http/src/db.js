const Influx = require("influx");

const influxConnectionFactory = () => {
  const influx = new Influx.InfluxDB({
    host: "influxdb",
    database: "iot",
    port: 8086,
  });
  //createDBIfNotExist(influx, "iot");
  return influx;
};

const createDBIfNotExist = (influx, dbName) => {
  influx
    .getDatabaseNames()
    .then((names) => {
      if (!names.include(dbName)) {
        return influx.createDatabase(dbName).then(() => {
          console.log(`Created database ${dbName}`);
        });
      }
    })
    .catch((err) => console.error(err));
};

const influx = influxConnectionFactory();
module.exports = influx;
