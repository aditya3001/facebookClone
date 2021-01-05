const route = require('express').Router()
const passport = require('passport')
const Post = require('../models/post')
const User = require('../models/user')

// route.get('/:userId', (req, res) => {
//     // console.log("Inside Profile", req.user)
//     let userP
//     User.findById(req.params.userId)
//         .then(user => userP = user)
//     Post.find({ 'user.id': req.params.userId })
//         .sort({ createdAt: -1 })
//         .then(posts => res.render('profile', {
//             posts,
//             user: userP

//         }))
//         .catch(err => console.log(err))
// })

route.get('/:userId', (req, res) => {

    return res.render('profile', {
        userId: req.params.userId
    })

})


route.post('/search', (req, res) => {
    console.log("IN SEARCH")
        // console.log(req.body.searchInputText)
    User.findOne({
            $or: [
                { email: req.body.searchInputText },
                { name: req.body.searchInputText },
                { login: req.body.searchInputText }
            ]
        })
        .then(user => {

            return res.redirect('/profile/' + user._id)
        })
        .catch(err => { return res.status(404).json({ msg: 'User not found' }) })
})


route.get('/posts/:userId', (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err) console.log(err)
        Post.find({ 'user.id': req.params.userId })
            .sort({ createdAt: -1 })
            .then(posts => {
                return res.send({
                    posts,
                    user
                })
            })
            .catch(err => console.log(err))

    })


})


route.get('/follow/:userId',
    // passport.authenticate('local', { session: false }),
    (req, res) => {
        // console.log(req.user.id)
        User.findOneAndUpdate({
                _id: req.user.id
            }, {
                $push: { following: req.params.userId }
            }, { new: true })
            .then(user => {
                console.log("IN FOLLOW")
                    // console.log(user)
                User.findOneAndUpdate({
                        _id: req.params.userId
                    }, {
                        $push: { followers: req.user.id }
                    }, { new: true })
                    .then(user => {
                        console.log(user)
                        res.json({ userId: req.params.userId })
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    })

route.get('/unfollow/:userId',
    // passport.authenticate('local', { session: false }),
    (req, res) => {
        console.log("Here In /unfollow")
        User.findOneAndUpdate({
                _id: req.user.id
            }, {
                $pull: { following: req.params.userId }
            }, { new: true })
            .then(user => {
                console.log("IN UNFOLLOW")
                    // console.log(user)
                User.findOneAndUpdate({
                        _id: req.params.userId
                    }, {
                        $pull: { followers: req.user.id }
                    }, { new: true })
                    .then(user => {
                        console.log("IN UNFOLLOW")
                        console.log(user)
                        res.json({ userId: req.params.userId })
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }
)

route.get('/checkFollowing/:currentProfileId', (req, res) => {
    // console.log("IN CHECK FOLLOWING")
    User.findOne({ _id: req.user.id })
        .then(user => {
            let isFollowing = user.following.includes(req.params.currentProfileId)
            if (isFollowing) {
                return res.send("alreadyFollowing")
            } else {
                return res.send("notFollowing")
            }
        })
        .catch(err => console.log(err))

})

route.get('/followers/:userId', (req, res) => {
    console.log('IN FOLLOWERS')
    console.log(req.params.userId)
    User.findOne({ _id: req.params.userId })
        .then(user => {
            User.find({
                '_id': { $in: user.followers }
            }).then(users => {
                console.log(users)
                res.render('followers', {
                    name: user.name,
                    followers: users
                })
            })

        })
        .catch(err => { return res.status(404).json({ msg: 'User not found' }) })
})

route.get('/following/:userId', (req, res) => {
    console.log('IN FOLLOWING')
    console.log(req.params.userId)
    User.findOne({ _id: req.params.userId })
        .then(user => {
            User.find({
                '_id': { $in: user.following }
            }).then(users => {
                console.log(users)
                res.render('following', {
                    name: user.name,
                    following: users
                })
            })

        })
        .catch(err => { return res.status(404).json({ msg: 'User not found' }) })
})

module.exports = route