const express = require("express");
const router = express.Router();

const userCollection = require("../models/user");
const pushMessage = require("../function/pushMessage");
const richmenu = require("../function/richMenu");

router.post("/", (req, res) => {
  const UID = req.body.uid;
  userCollection.find({ uid: UID }, function(err, docs) {
    if ((docs == "") | (docs == null)) {
      console.log("New UID detected!");
      res.status(200).send("This user can register.");
    } else {
      console.error("Duplicated UID detected!");
      res.status(401).send("This user can not register.");
      pushMessage.state("duplicated", UID);
      richmenu.changeMenu("mainmenu", UID);
    }
  });
});

module.exports = router;
