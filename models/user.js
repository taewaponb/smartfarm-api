const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema for plant
const plantSchema = new Schema(
  {
    farm: Number,
    water: String,
    height: Number,
    leaf: Number
  },
  { timestamps: true, versionKey: false }
); 

// schema for users
const userSchema = new Schema(
  {
    uid: String,
    name: String,
    tel: String,
    report: [plantSchema]
  },
  { timestamps: false, versionKey: false }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;