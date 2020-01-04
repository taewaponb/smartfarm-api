const mongoose = require("mongoose")
const Schema = mongoose.Schema

const sensorSchema = new Schema({
    farm: String,
    temp: Number,
    mois: Number
}, { timestamps: true, versionKey: false })

const SensorModel = mongoose.model('Sensor', sensorSchema)

module.exports = SensorModel