const mongoose = require('mongoose')
const {Schema} = mongoose

const resetPasswordSchema = new Schema({
    userId: String,
    resetString: String,
    expiredAt: Date
}, {timestamps: true})

module.exports = mongoose.model('ResetPassword', resetPasswordSchema)