const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const User = require('./models/user')
const Sensor = require('./models/sensor')

dotenv.config()

const PORT = process.env.PORT
const DBURL = process.env.DBURL

mongoose.connect(DBURL, { useUnifiedTopology: true })
mongoose.connection.on('error', err => {
    console.error('MongoDB error', err)
})

app.use(express.json())

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

app.get('/', (req, res) => res.end(`API is working fine. (Version 0.1.7)`));

app.get('/users', async(req, res) => {
    const users = await User.find()
    res.status(200).json(users)
})

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

app.get('/sensors', async(req, res) => {
    const sensors = await Sensor.find()
    res.status(200).json(sensors)
})

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

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})