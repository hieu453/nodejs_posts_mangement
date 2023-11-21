const mongoose = require('mongoose')
const { Schema } = mongoose
const uniqueValidator = require('mongoose-unique-validator');

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

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)