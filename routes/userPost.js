const express = require("express");
const dotenv = require("dotenv");
const line = require("@line/bot-sdk");
const router = express.Router();

const userCollection = require("../models/user");

// env
dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const LINE_TOKEN = process.env.LINE_TOKEN;

router.post("/", (req, res) => {
  const uid = req.body.uid;
  const payload = req.body;
  const user = new userCollection(payload);

  // check for blank line uid
  if (uid === null || uid === "") {
    res.status(400).send('Duplicated UID detected!');
    return null;
  }

  // check if account is exists
  userCollection
    .find({ uid: req.body.uid })
    .exec()
    .then(docs => {
      if (docs == "") {
        console.log("New UID detected!");
        user
          .save()
          .then(result => {
            // console.log(result);
            pushMessage("registered");
            res.status(201).send("Register Success!")
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        pushMessage("duplicated");
        console.log("Duplicated UID detected!");
        res.status(400).send("Register Failed! (Duplicated UID)")
      }
    })
    .catch(err => {
      console.log(err);
    });

  // push message if register success
  function pushMessage(state) {
    const client = new line.Client({
      channelAccessToken: LINE_TOKEN
    });
    if (state == "registered") {
      const message = [
        {
          type: "text",
          text: "สวัสดีค่ะคุณ " + req.body.name + "✨"
        },
        {
          type: "text",
          text:
            "สามารถใช้งานระบบรายงานผลผลิต โดยกดที่เมนูด้านล่างได้เลยค่ะ 👇😊"
        }
      ];
      client
        .pushMessage(req.body.uid, message)
        .then(() => {
          console.log("Push message to" + req.body.uid + "is done. (Registered)");
        })
        .catch(err => {
          console.log(err);
        });
    } else if (state == "duplicated") {
      const message = [
        {
          type: "text",
          text: "ขออภัยค่ะ คุณเคยทำการลงทะเบียนแล้วค่ะ"
        },
        {
          type: "text",
          text:
            "สามารถเริ่มใช้งานระบบการรายงานผลได้โดยกดเลือกที่เมนูด้านล่างค่ะ 👇😊"
        }
      ];
      client
        .pushMessage(req.body.uid, message)
        .then(() => {
          console.log("Push message to" + req.body.uid + "is done. (Duplicated)");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
});

module.exports = router;
