const line = require("@line/bot-sdk");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const LINE_TOKEN = process.env.LINE_TOKEN;

// this function will push the message to user.
module.exports = {
  state: function(state, UID, name) {
    const client = new line.Client({
      channelAccessToken: LINE_TOKEN
    });
    if (state == "registered") {
      const message = [
        {
          type: "text",
          text: "สวัสดีค่ะคุณ" + name + " ✨"
        },
        {
          type: "text",
          text:
            "สามารถใช้งานระบบรายงานผลผลิต โดยกดที่เมนูด้านล่างได้เลยค่ะ 👇😊"
        }
      ];
      client
        .pushMessage(UID, message)
        .then(() => {
          console.log("Push message to" + UID + "is done. (Registered)");
        })
        .catch(err => {
          console.error(err);
        });
    } else if (state == "duplicated") {
      const message = [
        {
          type: "text",
          text: "ขออภัยค่ะ คุณเคยทำการลงทะเบียนแล้วค่ะ 🔖"
        },
        {
          type: "text",
          text:
            "สามารถเริ่มใช้งานระบบการรายงานผลได้โดยกดเลือกที่เมนูด้านล่างค่ะ 👇😊"
        }
      ];
      client
        .pushMessage(UID, message)
        .then(() => {
          console.log("Push message to" + UID + "is done. (Duplicated)");
        })
        .catch(err => {
          console.error(err);
        });
    } else if (state == "verified") {
      let message = [
        {
          type: "template",
          altText: "เลือกพืชที่ต้องการตามภาพเลยค่ะ 😁",
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
          console.log("Push message to" + UID + "is done. (Verified)");
        })
        .catch(err => {
          console.error(err);
        });
    } else if (state == "confirmed") {
      let message = [
        {
          type: "text",
          text: "บันทึกผลไปยังฐานข้อมูลสำเร็จ ✅"
        },
        {
          quickReply: {
            items: [
              {
                action: {
                  type: "message",
                  label: "ต้องการ",
                  text: "รายงานผลพืชชนิดอื่น"
                },
                type: "action",
                imageUrl: "https://i.imgur.com/Upssluj.png"
              },
              {
                action: {
                  type: "message",
                  label: "ไม่ต้องการ",
                  text: "สิ้นสุดการรายงานผล"
                },
                type: "action",
                imageUrl: "https://i.imgur.com/mcDeC43.png/"
              }
            ]
          },
          type: "text",
          text: "ต้องการรายงานผลพืชชนิดอื่นหรือไม่?"
        }
      ];
      client
        .pushMessage(UID, message)
        .then(() => {
          console.log("Push message to" + UID + "is done. (Confirmed)");
        })
        .catch(err => {
          console.error(err);
        });
    }
    return state;
  }
};
