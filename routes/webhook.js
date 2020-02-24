const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const line = require("@line/bot-sdk");
const axios = require("axios");
const { WebhookClient } = require("dialogflow-fulfillment");

const userCollection = require("../models/user");

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

  // test webhook call
  function webhookTest(agent) {
    let data = req.body.originalDetectIntentRequest;
    agent.add("Webhook is fine ✅ Thanks for asking 🤗");
    if (data.source == undefined) {
      agent.add("Cannot get user LINE UID ❗️");
    } else {
      agent.add("User ID: " + data.payload.data.source.userId + "✨");
    }
  }

  // submit function for plant report
  async function submitData(agent) {
    // save a report data to database
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

  async function userCheck(agent) {
    let UID = req.body.originalDetectIntentRequest.payload.data.source.userId;
    await userCollection
      .find({
        uid: UID
      })
      .exec()
      .then(docs => {
        const client = new line.Client({
          channelAccessToken: LINE_TOKEN
        });
        if (docs == "") {
          // axios.get("https://api.line.me/v2/bot/richmenu/list", {
          //   headers: { Authorization: `Bearer ${LINE_TOKEN}` }
          // }).then(res => {
          //   console.log(res.data);
          // });
          console.log("User not found!");
          agent.add("ไม่พบไอดีผู้ใช้งานค่ะ ❌");
          agent.add("สามารถกดที่เมนูด้านล่างเพื่อลงทะเบียนได้เลยค่ะ 📋");
          
        } else {
          console.log("User found!");
          agent.add("เลือกพืชที่ต้องการตามภาพเลยค่ะ 😁");
          setTimeout(() => {
            const message = [
              {
                type: "template",
                altText: "this is a image carousel template",
                template: {
                  type: "image_carousel",
                  columns: [
                    {
                      imageUrl: "https://i.imgur.com/yaQEs1s.png",
                      action: {
                        type: "message",
                        label: "เลือก",
                        text: "กรีนโอ๊ค (Green Oak)"
                      }
                    },
                    {
                      imageUrl: "https://i.imgur.com/vgzQopy.png",
                      action: {
                        type: "message",
                        label: "เลือก",
                        text: "เรดโอ๊ค (Red Oak)"
                      }
                    },
                    {
                      imageUrl: "https://i.imgur.com/DB5IqA1.png",
                      action: {
                        type: "message",
                        label: "เลือก",
                        text: "คะน้า (Chinese Kale)"
                      }
                    },
                    {
                      imageUrl: "https://i.imgur.com/9TQWqYc.png",
                      action: {
                        type: "message",
                        label: "เลือก",
                        text: "กะเพรา (Holy Basil)"
                      }
                    },
                    {
                      imageUrl: "https://i.imgur.com/Eq1oFwa.png",
                      action: {
                        type: "message",
                        label: "เลือก",
                        text: "ขึ้นฉ่าย (Celery)"
                      }
                    }
                  ]
                }
              }
            ];
            client
              .pushMessage(UID, message)
              .then(() => {
                console.log("Push message to" + UID + "is done. (Registered)");
              })
              .catch(err => {
                console.log(err);
              });
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
