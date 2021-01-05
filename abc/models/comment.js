const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = mongoose.Schema({
    user: {
        type: Schema.Types.Object
            // required: true
    },
    post: {
        type: Schema.Types.Object
            // required: true
    },
    text: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

CommentSchema.pre('save', function(next) {
    if (this.isNew)
        this.created = new Date();

    this.updated = new Date();

    next();
});
module.exports = mongoose.model('Comment', CommentSchema)