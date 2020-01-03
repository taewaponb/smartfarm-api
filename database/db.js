var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://45.77.39.58:27017/";
const con = MongoClient;
con.connect(url, function(err, db) {
  if (err) {
    console.log(String(err));
  } else {
    console.log("MongoDB is Connected");
    db.db;
    var dbo = db.db("smartfarmDB");
    // var userInfo = [];
    // dbo.collection("users").findOne({}, function(err, result) {
    //   if (!err) {
    //     console.log("id = " + result._id);
    //     console.log("name = " + result.name);
    //     userInfo.push({
    //       userId: result._id,
    //       username: result.name
    //     });
    //     console.log(userInfo);
    //     db.close();
    // }
    // });
  }
});
