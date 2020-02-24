const express = require("express");
const router = express.Router();

const userCollection = require("../models/user");
const pushMessage = require("../function/pushMessage");
const richmenu = require("../function/richMenu");

router.post("/", (req, res) => {
  userCollection.find({ uid: req.body.uid }, function(err, docs) {
    if ((docs == "") | (docs == null)) {
      console.log("New UID detected!");
      res.status(200).send("true");
    } else {
      console.log("Duplicated UID detected!");
      res.status(401).send("false");
      pushMessage.state("duplicated", UID);
      richmenu.changeMenu("mainmenu", UID);
    }
  });
});

module.exports = router;
