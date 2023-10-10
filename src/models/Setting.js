const mongoose = require('mongoose')
const { Schema } = mongoose

const settingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Setting', settingSchema)