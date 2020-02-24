const express = require("express");
const dotenv = require("dotenv");
const line = require("@line/bot-sdk");
const router = express.Router();
const axios = require("axios");

const userCollection = require("../models/user");

// env
dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const LINE_TOKEN = process.env.LINE_TOKEN;

router.post("/", (req, res, next) => {
  const uid = req.body.uid;
  const payload = req.body;
  const user = new userCollection(payload);

  // check for blank line uid
  if (uid === null || uid === "") {
    res.status(400).send("LINE UID not found! Please enter LINE UID.");
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
            res.status(201).send("Register Success!");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        pushMessage("duplicated");
        console.log("Duplicated UID detected!");
        res.status(400).send("Register Failed! (Duplicated UID)");
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
          console.log(
            "Push message to" + req.body.uid + "is done. (Registered)"
          );
        })
        .catch(err => {
          console.log(err);
        });
    } else if (state == "duplicated") {

      let mainmenu = "richmenu-8660a8cdc168e27917e8b63c35e26cc8";
      axios
        .post(
          "https://api.line.me/v2/bot/user/" +
            req.body.uid +
            "/richmenu/" +
            mainmenu,
          {
            headers: { Authorization: `Bearer ${LINE_TOKEN}` }
          }
        )
        .then(res => {
          console.log("richmenu has changed!");
        });
        
      const message = [
        {
          type: "text",
          text: "ขออภัยค่ะ คุณเคยทำการลงทะเบียนแล้วค่ะ 🔖"
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
          console.log(
            "Push message to" + req.body.uid + "is done. (Duplicated)"
          );
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  function richmenuChange() {
    let mainmenu = "richmenu-8660a8cdc168e27917e8b63c35e26cc8";
    axios
      .post(
        "https://api.line.me/v2/bot/user/" +
          req.body.uid +
          "/richmenu/" +
          mainmenu,
        {
          headers: { Authorization: `Bearer ${LINE_TOKEN}` }
        }
      )
      .then(res => {
        console.log("richmenu has changed!");
      });
  }
});

module.exports = router;
