const route = require('express').Router()
const passport = require('passport')
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')

route.get('/', (req, res) => {
    // console.log("Inside Profile", req.user)

    return res.render('home', {
        user: req.user // passport gives us the current logged in user by req.user
    })
})



route.post('/addPost', (req, res) => {

    const text = req.body.text.trim()
    const newPost = new Post({
        user: {
            id: req.user.id,
            name: req.user.name,
            login: req.user.login
        },
        text
    })

    newPost
        .save()
        .then((post) => {
            console.log(post.user.name)
            res.send("success")
        })
        .catch(err => res.send(err))

    // Post.create(postData,(err,user)=>{
    //     if(err) return next(err)
    //     return res.redirect('/login')
    // })

})


// route.get('/posts', (req, res) => {
//     console.log("Inside GET POSTS")
//     Post.find()
//         .sort({ createdAt: -1 })

//     .then((posts) => {
//             res.send(posts)
//         })
//         .catch(err => console.log(err))
// })

route.get('/posts', (req, res) => {
    Post.find({
            $or: [
                { 'user.id': { $in: req.user.following } },
                { 'user.id': req.user.id }
            ]
        })
        .sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(err => console.log(err))
})


route.get('/post/like/:postId', (req, res) => {

    Post.findOneAndUpdate({
            _id: req.params.postId
        }, {
            $push: { likes: req.user.id }
        }, { new: true })
        .then(post => {
            console.log(post)
            return res.send('success')
        })
        .catch(err => { return console.log(err) })

})

route.get('/post/unlike/:postId', (req, res) => {

    Post.findOneAndUpdate({
            _id: req.params.postId
        }, {
            $pull: { likes: req.user.id }
        }, { new: true })
        .then(post => {
            console.log(post)
            return res.send('success')
        })
        .catch(err => { return console.log(err) })

})

route.get('/comment/:postId/', (req, res) => {
    Comment.find({
            'post.id': req.params.postId
        })
        .sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(err => console.log(err))
})

route.post('/addComment/:postId/', (req, res) => {

    const text = req.body.text.trim()

    const newComment = new Comment({
        user: {
            id: req.user.id,
            name: req.user.name
        },
        post: {
            id: req.params.postId
        },
        text
    })

    newComment
        .save()
        .then((comment) => {
            console.log('IN COMMENTS')
            console.log(comment)
            res.send("success")
        })
        .catch(err => res.send(err))

})

// route.get('/getLikeState/:postId', (req, res) => {
//     Post.findOne({ _id: req.params.postId })
//         .then(post => {
//             let isLiking = post.likes.includes(req.user.id)
//             if (isLiking) {
//                 return res.send("liked")
//             } else {
//                 return res.send("notLiked")
//             }
//         })
//         .catch(err => { return res.send(err) })
// })

route.get('/getLikeState/:postId', (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .then(post => {
            let isLiking = post.likes.includes(req.user.id)
            if (isLiking) {
                return res.json({
                    state: "liked",
                    numLikes: post.likes.length
                })
            } else {
                return res.json({
                    state: "notLiked",
                    numLikes: post.likes.length
                })
            }
        })
        .catch(err => { return res.send(err) })
})

module.exports = route