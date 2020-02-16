const express = require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const line = require('@line/bot-sdk');

const User = require('./models/user')
const Sensor = require('./models/sensor')

const app = express();
dotenv.config()

// env
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
const LINE_TOKEN = process.env.LINE_TOKEN

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
    const uid = req.body.uid
    const payload = req.body
    const user = new User(payload)

    // check for blank line uid
    if (uid == null || uid == "") {
        res.status(400).json({
            message: 'LINE uid not found!', params
        });
        return null
    }

    // check if account is exists
    User.find({ uid: req.body.uid })
        .exec()
        .then(docs => {
            if (docs == "") {
                console.log('New UID detected!');
                user.save()
                    .then(result => {
                        // console.log(result);
                        pushMessage('registered');
                        res.status(201).end()
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            }
            else {
                console.log("Duplicated UID detected!")
                pushMessage('duplicated')
            }
        }).catch((err) => {
            console.log(err);
        });

    function pushMessage(state) {
        const client = new line.Client({
            channelAccessToken: LINE_TOKEN
        });
        if (state == 'registered') {
            const message = [
                {
                    type: 'text',
                    text: 'สวัสดีค่ะ ' + req.body.name + '✨'
                },
                {
                    type: 'text',
                    text: 'สามารถใช้งานระบบรายงานผลผลิต โดยกดที่เมนูด้านล่างได้เลยค่ะ 👇😊'
                }
            ];
            client.pushMessage(req.body.uid, message)
                .then(() => {
                    console.log('New user added!')
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (state == 'duplicated') {
            const message = [
                {
                    type: 'text',
                    text: 'ขออภัยค่ะ คุณได้ทำการลงทะเบียนเรียบร้อยแล้วค่ะ'
                },
                {
                    type: 'text',
                    text: 'สามารถเริ่มใช้งานระบบการรายงานผลได้โดยกดเลือกที่เมนูด้านล่างค่ะ 👇😊'
                }
            ];
            client.pushMessage(req.body.uid, message)
                .then(() => {
                    console.log('Already registered!')
                })
                .catch((err) => {
                    console.log(err);
                });
        }
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