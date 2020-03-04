const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const LINE_TOKEN = process.env.LINE_TOKEN;

// this function will change richmenu for registered user.
module.exports = {
  changeMenu: function(menu, UID) {
    let mainmenu = "richmenu-47feb284d5e79bc587430b4b613c0aef";
    if (menu == "register") {
      axios({
        method: "delete",
        url: `https://api.line.me/v2/bot/user/${UID}/richmenu/`,
        headers: { Authorization: `Bearer ${LINE_TOKEN}` }
      })
        .then(res => {
          // console.log(res);
          console.log("richmenu has changed to register!");
        })
        .catch(err => {
          // console.error(err);
          console.error("failed to changed to register!");
        });
    } else if (menu == "mainmenu") {
      axios({
        method: "post",
        url: `https://api.line.me/v2/bot/user/${UID}/richmenu/${mainmenu}`,
        headers: { Authorization: `Bearer ${LINE_TOKEN}` }
      })
        .then(res => {
          // console.log(res);
          console.log("richmenu has changed to mainmenu!");
        })
        .catch(err => {
          // console.error(err);
          console.error("failed to changed to mainmenu!");
        });
    }
    return(menu);
  }
};
