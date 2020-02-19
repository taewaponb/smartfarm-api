const express = require("express");
const router = express.Router();
const { WebhookClient } = require("dialogflow-fulfillment");

router.post("/", (req, res) => {
  console.log("POST: /");
  console.log("Body: ", req.body);

  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res
  });

  //Test get value of WebhookClient
  console.log("agentVersion: " + agent.agentVersion);
  console.log("intent: " + agent.intent);
  console.log("locale: " + agent.locale);
  console.log("query: ", agent.query);
  console.log("session: ", agent.session);

  //Function Location
  function webhookTest(agent) {
    agent.add("Webhook is fine. Thanks for asking :D");
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set("Webhook", webhookTest); // "Location" is once Intent Name of Dialogflow Agent
  agent.handleRequest(intentMap);
});

module.exports = router;
