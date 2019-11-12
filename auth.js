const passport = require('koa-passport');
const BasicStrategy= require('passport-http').BasicStrategy;

//we need user model to connect to DB to verify user credentials
const User = require('./models/users');

//implement the basic auth strategy
passport.use(new BasicStrategy(
    //this is callback function that will receive the userid and password
    //after extracting them from the request header
    (userid, password, done) => {
        //we need to create User.findOne function
        //this function receives user auth data and tries to find them in the DB
        //it also receives a callback to pass either error or user object
        User.findOne({ username: userid, password: password}, (err, user) => {
            //final decision will depend on the result of verification
            //which we receive from the findOne function
            //we will use done() method which is provided by Passport to save final decision
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        })
    }
))