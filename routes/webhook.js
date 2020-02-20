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

  // test webhook call
  function webhookTest(agent) {
    agent.add("Webhook is fine ✅ Thanks for asking 🤗 ");
  }

  // submit function for plant report
  function submit(agent) {
    // get report data from dialogflow parameters.
    let farm = agent.parameters["farm"];
    let water = agent.parameters["water"];
    let height = agent.parameters["height"];
    let leaf = agent.parameters["leaf"];

    let UID = data.originalDetectIntentRequest.payload.data.source.userId;

    console.log(UID);

    agent.add(
      "ฟาร์มที่" +
        farm +
        "\nwater" +
        water +
        "\nheight" +
        height +
        "\nleaf" +
        leaf
    );

    agent.add("บันทึกผลไปยังฐานข้อมูลเรียบร้อยค่ะ ✅");
    agent.add(
      'หากต้องการรายงานผลเพิ่มเติม 📋 \nกดที่เมนู "รายงานผลการเพาะปลูก" หรือพิมพ์ "รายงานผล" ได้เลยค่ะ ✨'
    );
  }

  // function will run when dialogflow intent match
  let intentMap = new Map();
  intentMap.set("Webhook", webhookTest);
  intentMap.set("GOSFWHLY", submit);
  agent.handleRequest(intentMap);
});

module.exports = router;
