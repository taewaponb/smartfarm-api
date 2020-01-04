const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    tel: String,
    uid: String
}, { timestamps: true, versionKey: false })

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel