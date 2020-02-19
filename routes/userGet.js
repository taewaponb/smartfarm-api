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

// get list of users
router.get("/users", async (req, res) => {
  const users = await userCollection.find();
  res.status(200).json(users);
});

module.exports = router;
