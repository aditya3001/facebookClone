const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const session = require('express-session')
const passport = require('./passport')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// mongodb connection
mongoose.connect('mongodb://localhost:27017/twitter', { useFindAndModify: false })
const db = mongoose.connection
db.on('error', (err) => {
    console.error(err)
})
app.use(session({
    secret: 'adnabdasndvasmvdvvdabsd',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'));
app.use('/', express.static(path.join(__dirname, 'static')))
app.use('/profile/', express.static(path.join(__dirname, 'static')))
app.use('/login', require('./routes/login'))
app.use('/home', require('./routes/home'))
app.use('/signup', require('./routes/signup'))
app.use('/profile', require('./routes/profile'))
    // app.use('/follow', require('./routes/follow'))
    // Get '/logout
app.get('/logout', (req, res, next) => {
    req.session.destroy(function(err) {
        if (err) return next(err)
        console.log('Here')
        return res.redirect('/login')
    })
})

// Error handler Middleware - Last middle ware
app.use((err, req, res, next) => {
    return res.render('error', {
        message: err.message,
        title: 'Error Page'
    })
})

app.listen(4444, () => {
    console.log('Server Started at http://localhost:4444/login')
})