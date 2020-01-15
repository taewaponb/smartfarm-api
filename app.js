const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const line = require('@line/bot-sdk');

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
    const uid = req.body.uid
    const payload = req.body
    const user = new User(payload)

    // check for blank line uid
    if (uid == null || uid == "") {
        res.json({
            status: 'error',
            message: 'Line UID not found! (error from if)'
        });
        return null;
    }
    
    // try {
    //     const user = new User(payload)
    //     await user.save()
    //     res.status(201).end()
    // } catch (error) {
    //     res.status(400).json(error)
    // }

    // check if account is exists
    User.find({ uid: req.body.uid })
        .exec()
        .then(docs => {
            if (docs == "") {
                console.log('This line UID is new.');
                user.save()
                    .then(result => {
                        // console.log(result);
                        pushMessage('registered');
                        res.status(201).end()
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(error)
                    });
            }
            else {
                res.json({
                    status: '0000',
                    message: 'This line UID is already exists.'
                });
            }
        }).catch(err => {
            console.log(err)
            res.json({
                message: 'Line UID not found! (error from catch)',
            });
        });

    function pushMessage(state) {
        if (state == 'registered') {
            const client = new line.Client({
                channelAccessToken: 'ZtOCZqPA/UVGqKG8c65zz2/WtE3JsQ8dQv6FfZG/UG3MCLRhbeE+OP2Iw3pxHO6Fmarp0Q3rGGWGRIshFZ3XrD2IFB/MZiazqKA6pxPveyLigi0diBWudOy8J7Enef+TszYX2kgZfUSbc2RAYanaw1GUYhWQfeY8sLGRXgo3xvw='
            });
            const message = [
                {
                    type: 'text',
                    text: 'สวัสดีค่ะคุณ ' + req.body.name
                },
                {
                    type: 'text',
                    text: 'สามารถเริ่มใช้งานระบบการรายงานผลได้โดยกดเลือกที่เมนูด้านล่างค่ะ 👇😊'
                }
            ];
            client.pushMessage(req.body.uid, message)
                .then(() => {
                    console.log('push message done!')
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