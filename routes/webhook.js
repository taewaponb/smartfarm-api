const express = require("express");
const router = express.Router();
const { WebhookClient } = require("dialogflow-fulfillment");

const userCollection = require("../models/user");

router.post("/", (req, res, next) => {
  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res
  });

  console.log("Body: ", req.body);
  // console.log("agentVersion: " + agent.agentVersion);
  // console.log("intent: " + agent.intent);
  // console.log("locale: " + agent.locale);
  // console.log("query: ", agent.query);
  // console.log("session: ", agent.session);

  // test webhook call
  function webhookTest(agent) {
    let data = req.body.originalDetectIntentRequest;
    agent.add("Webhook is fine ✅ Thanks for asking 🤗 ");
    if (data.source == undefined) {
      agent.add("Cannot get user LINE UID.");
    } else {
      agent.add("User ID: " + data.payload.data.source.userId + "✨");
    }
  }

  // submit function for plant report
  function submit(agent) {
    let UID = req.body.originalDetectIntentRequest.payload.data.source.userId;
    let farm = agent.parameters["farm"];
    let water = agent.parameters["water"];
    let height = agent.parameters["height"];
    let leaf = agent.parameters["leaf"];

    // save a report data to database
    userCollection
      .updateOne(
        { uid: UID },
        {
          $push: {
            report: {
              farm: farm,
              water: water,
              height: height,
              leaf: leaf
            }
          }
        }
      )
      .then(docs => {
        console.log("Report Saved!");
        agent.add("บันทึกผลไปยังฐานข้อมูลเรียบร้อยค่ะ ✅");
        agent.add(
          'หากต้องการรายงานผลเพิ่มเติม 📋 \nกดที่เมนู "รายงานผลการเพาะปลูก" หรือพิมพ์ "รายงานผล" ได้เลยค่ะ ✨'
        );
      })
      .catch(err => {
        console.log("Report Failed!");
        agent.add("บันทึกผลไปยังฐานข้อมูลไม่สำเร็จค่ะ ❌");
        agent.add(
          'หากต้องการรายงานผลเพิ่มเติม 📋 \nกดที่เมนู "รายงานผลการเพาะปลูก" หรือพิมพ์ "รายงานผล" ได้เลยค่ะ ✨'
        );
      });
  }

  // function will run when dialogflow intent match
  let intentMap = new Map();
  intentMap.set("Webhook", webhookTest);
  intentMap.set("GOSFWHLY", submit);
  agent.handleRequest(intentMap);
});

module.exports = router;
