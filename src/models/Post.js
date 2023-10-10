const mongoose = require('mongoose')
const { Schema } = mongoose
const dompurify = require('dompurify')
const { JSDOM } = require('jsdom')
const htmlPurifier = dompurify(new JSDOM().window)

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, { timestamps: true })

postSchema.pre('validate', function (next) {
    if (this.description) {
        this.description = htmlPurifier.sanitize(this.description)
    }
    next();
})

module.exports = mongoose.model('Post', postSchema)