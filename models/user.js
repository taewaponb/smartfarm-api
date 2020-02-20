const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema for users
const userSchema = new Schema(
  {
    uid: String,
    name: String,
    tel: String,
    report: [
      {
        farm: Number,
        water: String,
        height: Number,
        leaf: Number
      }
    ]
  },
  { timestamps: false, versionKey: false }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
