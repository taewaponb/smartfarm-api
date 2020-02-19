const express = require("express");
const app = express();
const dotenv = require("dotenv");
const line = require('@line/bot-sdk');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());

// env
dotenv.config()
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
const LINE_TOKEN = process.env.LINE_TOKEN

// models
const userCollection = require('./models/user')

// routes
const verifyRoute = require("./routes/verify");
const registerRoute = require("./routes/userPost");
const webhookRoute = require("./routes/webhook");

app.use('/verify', verifyRoute);
app.use('/users', registerRoute);
app.use('/webhook', webhookRoute);

mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connection.on('error', err => {
    console.error('MongoDB error', err)
})

// copy from chompoo (Thank!)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
})

// check if API is now working
app.get('/', (res) => res.end(`API is working fine.`));

// use to display port in console (running on local)
app.listen(PORT, () => {
    console.log(`API is working fine. Running local on port ${PORT}`);
})





