const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        // required:true,
        unique: true,
        // trim:true
    },
    name: {
        type: String,
        required: true,
        // unique:true,
        // trim:true
    },
    password: {
        type: String,
        // required:true
    },
    fbID: {
        type: String
    },
    fbToken: {
        type: String
    },
    twitterId: {
        type: String
    },
    twitterToken: {
        type: String
    },
    followers: [],
    following: [],
    // followers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }],
    // following: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }],
    postCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    postLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }]

})

UserSchema.statics.authenticate = (email, password, cb) => {
    console.log(email)
    User.findOne({ email })
        .exec((err, user) => {
            if (err) return cb(err)
            else if (!user) {
                let err = new Error('User Not Found!')
                err.status = 401
                return cb(err)
            }
            if (password != user.password) {
                let err = new Error('Password doesnt match!')
                err.status = 401
                return cb(err)
            }
            return cb(null, user)
        })
}

const User = mongoose.model('User', UserSchema)
module.exports = User