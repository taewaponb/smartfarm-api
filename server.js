// Declare constant variable
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

var url = "mongodb://45.77.169.107:27017/";
const access = require("access-control");
const cookie = require("cookie-session");
const core = access({ maxAge: "8 hours", credentials: true, origin: true });

const app = express();
const port = process.env.PORT || 4000;
const version = "/api/v1/";
const db = require("./database/db");

app.use(core);
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  cors({
    optionsSuccessStatus: 200,
    preflightContinue: true,
    credentials: true
  })
);

app.listen(port, function() {
  console.log("Server is running port: " + port);
});

app.post("/sendInfo", (req, res) => {
  const { name, tel, lineId } = req.body;
  db.connect(url, function(err, db) {
    if (err) {
      console.log(String(err));
    } else {
      console.log("MongoDB is Connected");
      db.db;
      var dbo = db.db("smartfarmDB");
      var myobj = { name: name, tel: tel, lineId: lineId };
      dbo.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
        db.close();
      });
    }
  });
  res.json({
    status: "Successful!"
  });
});

app.post("/sendInfoSensor", (req, res) => {
  const { farm, date, temp, mois } = req.body;
  db.connect(url, function(err, db) {
    if (err) {
      console.log(String(err));
    } else {
      db.db;
      var dbo = db.db("sensorDB");
      var myobj2 = { farm: farm, date: date, temp: temp, mois };
      dbo.collection("sersor").insertOne(myobj2, function(err, res) {
        if (err) throw err;
        db.close();
      });
    }
  });
  res.json({
    status: "Successful!"
  });
});

app.get('/', (req, res) => res.end(`API is working fine. (Version 0.1.1)`));

app.get("/testPython", (req, res) => res.send("Hello from Python"));
