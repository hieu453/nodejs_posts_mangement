const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    default_avatar: {
        type: String,
    },
    role: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('User', userSchema)