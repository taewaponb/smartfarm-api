const mongoose = require("mongoose")
const Schema = mongoose.Schema

// schema for users
const userSchema = new Schema({
    uid: String,
    name: String,
    tel: String,
    plant: [plantSchema]
}, { timestamps: false, versionKey: false })

const plantSchema = new Schema({
    plant: String,
    level: Number
}, { timestamps: true, versionKey: false })

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel