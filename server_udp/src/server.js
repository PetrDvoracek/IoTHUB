const express = require("express");
const Influx = require("influx");
const os = require("os");
const db = require("./db");

// Constants
const PORT = 80;
const HOST = "0.0.0.0";
// App
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Service up");
});
app.post("/api", (req, res) => {
  const influxPoint = {
    measurement: req.body.id,
    tags: { rssi: req.body.rssi },
    fields: { data: req.body.data }
  };
  db.writePoints([influxPoint])
    .then(() => {
      res.send(`Added data to DB with POST ${JSON.stringify(influxPoint)}`);
    })
    .catch(err => {
      console.error(err);
      res.send(`ERROR! ${err}`);
    });
});
app.get("/api", (req, res) => {
  const influxPoint = {
    measurement: req.query.id,
    tags: { rssi: req.query.rssi },
    fields: { data: req.query.data }
  };
  db.writePoints([influxPoint])
    .then(() => {
      res.send(`Added data to DB with GET ${JSON.stringify(influxPoint)}`);
    })
    .catch(err => {
      console.error(err);
      res.send(`ERROR! ${err}`);
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
