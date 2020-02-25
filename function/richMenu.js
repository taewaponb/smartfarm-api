const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const LINE_TOKEN = process.env.LINE_TOKEN;

// this function will change richmenu for registered user.
module.exports = {
  changeMenu: function(menu, UID) {
    let mainmenu = "richmenu-e9e7e259be99b94fa7abbb45a330debf";
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
          // console.log(err);
          console.log("failed to changed to register!");
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
          // console.log(err);
          console.log("failed to changed to mainmenu!");
        });
    }
    return(menu);
  }
};
