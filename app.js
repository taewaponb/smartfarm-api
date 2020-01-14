const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const User = require('./models/user')
const Sensor = require('./models/sensor')

dotenv.config()

const PORT = process.env.PORT
const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL, { useUnifiedTopology: true })
mongoose.connection.on('error', err => {
    console.error('MongoDB error', err)
})

app.use(express.json())

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
app.get('/', (req, res) => res.end(`API is working fine.`));

// use to display port in console (running on local)
app.listen(PORT, () => {
    console.log(`API is working fine. Running local on port ${PORT}`);
})

// get list of users
app.get('/users', async(req, res) => {
    const users = await User.find()
    res.status(200).json(users)
})

// post a new user (register)
app.post('/users', async(req, res) => {
    const payload = req.body
    try {
        const user = new User(payload)
        await user.save()
        res.status(201).end()
    } catch (error) {
        res.status(400).json(error)
    }
})

// get a list of sensors data
app.get('/sensors', async(req, res) => {
    const sensors = await Sensor.find()
    res.status(200).json(sensors)
})

// post a data of sensor
app.post('/sensors', async(req, res) => {
    const payload = req.body
    try {
        const sensors = new Sensor(payload)
        await sensors.save()
        res.status(201).end()
    } catch (error) {
        res.status(400).json(error)
    }
})