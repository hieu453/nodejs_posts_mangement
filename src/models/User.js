const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('User', userSchema)