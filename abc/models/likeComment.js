const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeCommentSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _comment: { type: Schema.Types.ObjectId, ref: 'Comment' },

    created: Date,
    updated: Date
}, {
    collection: 'likeComments',
    strict: true,
    autoIndex: true
});

LikeCommentSchema.pre('save', function(next) {
    if (this.isNew)
        this.created = new Date();

    this.updated = new Date();

    next();
});

module.exports = LikeComment = mongoose.model('LikeComment', LikeCommentSchema);