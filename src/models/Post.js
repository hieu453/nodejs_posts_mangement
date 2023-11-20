const mongoose = require('mongoose')
const { Schema } = mongoose
const dompurify = require('dompurify')
const { JSDOM } = require('jsdom')
const htmlPurifier = dompurify(new JSDOM().window)
const mongoosePaginate = require('mongoose-paginate');

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
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
    modified: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

postSchema.plugin(mongoosePaginate);

postSchema.pre('validate', function (next) {
    if (this.description) {
        this.description = htmlPurifier.sanitize(this.description)
    }
    next();
})

module.exports = mongoose.model('Post', postSchema)