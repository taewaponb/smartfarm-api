const express = require("express");
const dotenv = require("dotenv");
const line = require('@line/bot-sdk');
const router = express.Router();

const userCollection = require('../models/user');

// env
dotenv.config()
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL
const LINE_TOKEN = process.env.LINE_TOKEN

router.post("/", (req, res, next) => {

    userCollection.find({ uid: req.body.uid }, function (err, docs) {

        if (docs == "" | docs == null) {
            console.log('New user detected!');
            res.status(200).send('true');
        }
        else {
            console.log('Duplicate user detected!');
            res.status(401).send('false');
            const client = new line.Client({
                channelAccessToken: LINE_TOKEN
            });
            const message = [{
                type: 'text',
                text: 'ขออภัยค่ะ คุณเคยทำการลงทะเบียนแล้วค่ะ'
            },
            {
                type: 'text',
                text: 'สามารถเริ่มใช้งานระบบการรายงานผลได้โดยกดเลือกที่เมนูด้านล่างค่ะ 👇😊'
            }]
            client.pushMessage(req.body.uid, message)
                .then(() => {
                    console.log('Push message to' + req.body.uid + 'is done.')
                })
                .catch((err) => {
                    console.log(err);   // error when use fake line id 
                });
        }

    });

});

module.exports = router;