const express = require("express");
const router = express.Router();
const { WebhookClient } = require("dialogflow-fulfillment");

router.post("/", (req, res) => {
  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res
  });

  console.log("Body: ", req.body);
  console.log("agentVersion: " + agent.agentVersion);
  console.log("intent: " + agent.intent);
  console.log("locale: " + agent.locale);
  console.log("query: ", agent.query);
  console.log("session: ", agent.session);

  //Function Location
  function webhookTest(agent) {
    agent.add("Webhook is fine ✅ Thanks for asking 🤗 ");
  }

  function submit(agent) {
    let farm = agent.parameters["farm"];
    agent.add("ฟาร์มที่" + farm);
    agent.add("บันทึกผลไปยังฐานข้อมูลเรียบร้อยค่ะ ✅");
    agent.add("หากต้องการรายงานผลเพิ่มเติม 📋 \nกดที่เมนู \"รายงานผลการเพาะปลูก\" หรือพิมพ์ \"รายงานผล\" ได้เลยค่ะ ✨");
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set("Webhook", webhookTest);
  intentMap.set("GOSFWHLY", submit)
  agent.handleRequest(intentMap);
});

module.exports = router;
