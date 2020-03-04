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

// get list of users.
router.get("/", async (req, res, next) => {
  const users = await userCollection.find();
  res.status(200).json(users);
});

// get only uid matched user.
router.get("/:uid", async (req, res, next) => {
  const UID = req.params.uid
  await userCollection.findOne({ uid: UID })
  .then(docs => {
    if (docs == "" | docs == null) {
      res.status(404).end("UID Not found!");
    } else {
      res.status(200).json(docs);
    }
  }).catch(err => {
    console.error(err);
  })
});

module.exports = router;
