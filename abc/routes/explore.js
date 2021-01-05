const route = require('express').Router()
const passport = require('passport')

route.post('/', passport.authenticate('local', {
    failureRedirect: '/hello',
    successRedirect: '/profile'
}))