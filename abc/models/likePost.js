const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikePostSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _post: { type: Schema.Types.ObjectId, ref: 'Post' },

    created: Date,
    updated: Date
}, {
    collection: 'likePosts',
    strict: true,
    autoIndex: true
});

LikePostSchema.pre('save', function(next) {
    if (this.isNew)
        this.created = new Date();

    this.updated = new Date();

    next();
});

module.exports = LikePost = mongoose.model('LikePost', LikePostSchema);