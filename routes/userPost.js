const express = require("express");
const dotenv = require("dotenv");
const line = require("@line/bot-sdk");
const router = express.Router();

const userCollection = require("../models/user");
const richmenu = require("../function/richMenu");
const pushMessage = require("../function/pushMessage");

dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const LINE_TOKEN = process.env.LINE_TOKEN;

router.post("/", (req, res, next) => {
  const UID = req.body.uid;
  const payload = req.body;
  const user = new userCollection(payload);

  // check for blank line uid
  if (UID === null || UID === "") {
    res.status(400).send("LINE UID not found! Please enter LINE UID.");
    return null;
  }

  // check if account is exists
  userCollection
    .find({ uid: UID })
    .exec()
    .then(docs => {
      if (docs == "") {
        console.log("New UID detected!");
        user
          .save()
          .then(result => {
            // console.log(result);
            pushMessage.state("registered", UID);
            richmenu.changeMenu("mainmenu", UID);
            res.status(201).send("Register Success!");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        pushMessage.state("duplicated", UID);
        richmenu.changeMenu("mainmenu", UID);
        console.log("Duplicated UID detected!");
        res.status(400).send("Register Failed! (Duplicated UID)");
      }
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
