const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { WebhookClient } = require("dialogflow-fulfillment");

const userCollection = require("../models/user");
const richmenu = require("../function/richMenu");
const pushMessage = require("../function/pushMessage");

dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const LINE_TOKEN = process.env.LINE_TOKEN;

router.post("/", (req, res, next) => {
  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res
  });

  // console.log("Body: ", req.body);

  // use to test if webhook is working.
  function webhookTest(agent) {
    let data = req.body.originalDetectIntentRequest;
    agent.add("Webhook is fine ✅ Thanks for asking 🤗");
    if (data.source == undefined) {
      agent.add("Cannot get user LINE UID ❗️");
    } else {
      agent.add("User ID: " + data.payload.data.source.userId + "✨");
    }
  }

  // submit function for plant report.
  async function submitData(agent) {
    // save a report data to database.
    await userCollection
      .updateOne(
        {
          uid: req.body.originalDetectIntentRequest.payload.data.source.userId
        },
        {
          $push: {
            report: {
              farm: agent.parameters["farm"],
              water: agent.parameters["water"],
              height: agent.parameters["height"],
              leaf: agent.parameters["leaf"]
            }
          }
        }
      )
      .then(docs => {
        console.log(docs);
        console.log("Report Saved!");
        agent.add("บันทึกผลไปยังฐานข้อมูลสำเร็จ ✅");
        agent.add(
          'หากต้องการรายงานผลเพิ่มเติม 📋 \nกดที่เมนู "รายงานผลการเพาะปลูก" หรือพิมพ์ "รายงานผล" ได้เลยค่ะ ✨'
        );
      })
      .catch(err => {
        console.log(err);
        console.log("Report Failed!");
        agent.add("บันทึกผลไปยังฐานข้อมูลไม่สำเร็จค่ะ ❌");
        agent.add(
          'หากต้องการรายงานผลเพิ่มเติม 📋 \nกดที่เมนู "รายงานผลการเพาะปลูก" หรือพิมพ์ "รายงานผล" ได้เลยค่ะ ✨'
        );
      });
  }

  // check for an unregistered user.
  async function userCheck(agent) {
    const UID = req.body.originalDetectIntentRequest.payload.data.source.userId;
    // find user in database
    await userCollection
      .find({
        uid: UID
      })
      .exec()
      .then(docs => {
        if (docs == "") {
          console.log("User not found!");
          agent.add("ไม่พบไอดีผู้ใช้งานค่ะ ❌");
          agent.add("สามารถกดที่เมนูด้านล่างเพื่อลงทะเบียนได้เลยค่ะ 📋");
          richmenu.changeMenu("register", UID); // using richmenu function to change user richmenu.
        } else {
          console.log("User found!");
          agent.add("เลือกพืชที่ต้องการตามภาพเลยค่ะ 😁");
          setTimeout(() => {
            pushMessage.state("verified", UID); // using pushMessage function to send a messages.
          }, 50);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // function will run when dialogflow intent match
  let intentMap = new Map();
  intentMap.set("Webhook", webhookTest);
  intentMap.set("GOSFWHLY", submitData);
  intentMap.set("PR", userCheck);
  agent.handleRequest(intentMap);
});

module.exports = router;
