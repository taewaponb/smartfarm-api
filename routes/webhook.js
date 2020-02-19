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
    agent.add("Webhook is fine ✅. Thanks for asking 🤗 ");
    agent.add("Webhook is working fine ✅. you're good to go ✌️");
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set("Webhook", webhookTest);
  agent.handleRequest(intentMap);
});

module.exports = router;
