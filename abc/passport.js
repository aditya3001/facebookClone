const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const User = require('./models/user')

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        // console.log("Inside local strategy")

        User.findOne({ email }, (err, user) => {
            // console.log(user)
            if (err) return done(err)
            if (!user) return done(null, false)
            if (user.password != password) {
                return done(null, false)
            }

            return done(null, user)
        })
    }
))

passport.use(new FacebookStrategy({
        clientID: '433865687739167',
        clientSecret: '36f7eb783ea87ffc6e418a7ce8642ca3',
        callbackURL: "http://localhost:4444/login/facebook/callback"
    },
    async(token, rt, profile, cb) => {
        // console.log(token)
        // console.log(profile)
        let user = await User.findOne({
            fbID: profile.id
        })
        if (user) return cb(null, user)
        user = await User.create({ fbID: profile.id, fbToken: token, name: profile.displayName })
        return cb(null, user)
    }
))

passport.use(new TwitterStrategy({
        consumerKey: "Mq2hMVRYqDhjEehgY0BygzQOt",
        consumerSecret: "ZteLhObND2gHiPJMjtzGrQp68MGawKIO40dKOKNkSHCSmUs2eQ",
        callbackURL: "http://localhost:4444/login/twitter/callback"
    },
    async(token, tokenSecret, profile, cb) => {
        // console.log(token)
        // console.log(profile)
        let user = await User.findOne({
            twitterId: profile.id
        })

        if (user) return cb(null, user)
        user = await User.create({ twitterId: profile.id, twitterToken: token, name: profile.displayName, email: profile.displayName }, function(err, user) {
            console.log(user)
            return cb(err, user);
        });
    }
));

// Convert user to user.id
passport.serializeUser((user, cb) => {
    // console.log('Serialize user')
    // console.log(user.id)
    cb(null, user.id)
})

// deserialize
passport.deserializeUser((id, cb) => {
    // console.log('Deserialize user')
    // console.log(id)
    User.findById(id, (err, user) => {
        if (err) return cb(err)
            // console.log("User after deserialization ", user)
        return cb(null, user)
    })
})

module.exports = passport