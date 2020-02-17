const express = require("express");
const dotenv = require("dotenv");
const line = require('@line/bot-sdk');
const mongoose = require("mongoose");

// models
const userCollection = require('./models/user')

// routes
const verifyRoutes = require("./routes/verify.js");

// env
dotenv.config()
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
const LINE_TOKEN = process.env.LINE_TOKEN

const app = express();

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
    const users = await userCollection.find()
    res.status(200).json(users)
})

// post a new user (register)
app.post('/users', async(req, res) => {
    const uid = req.body.uid
    const payload = req.body
    const user = new userCollection(payload)

    // check for blank line uid
    if (uid === null || uid === "") {
        res.status(400).end();
        return null
    }

    // check if account is exists
    userCollection.find({ uid: req.body.uid })
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
                res.status(400).end()
            }
        }).catch((err) => {
            console.log(err);
        });

    // push message if register success
    function pushMessage(state) {
        const client = new line.Client({
            channelAccessToken: LINE_TOKEN
        });
        if (state == 'registered') {
            const message = [
                {
                    type: 'text',
                    text: 'สวัสดีค่ะคุณ ' + req.body.name + '✨'
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
                    text: 'ขออภัยค่ะ คุณเคยทำการลงทะเบียนแล้วค่ะ'
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

app.use('/verify', verifyRoutes );