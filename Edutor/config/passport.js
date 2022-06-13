const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');


function localStrategy(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, ( email, password, done) => {
            User.findOne({ where: { email: email } })
                .then(user => {
                    if (!user) {
                        console.log("user not found")
                        return done(null, false, { message: 'No User Found' });
                    }
                    // Match password
                    isMatch = bcrypt.compareSync(password, user.password);
                    if (!isMatch) {
                        return done(null, false, {
                            message: 'Password incorrect'
                        });
                    } else {
                        console.log("Login! 1")
                        done(null, user);
                    }
                })
        }));
    // Serializes (stores) user id into session upon successful
    // authentication
    passport.serializeUser((user, done) => {
        // console.log("Login! 2")

        // user.id is used to identify authenticated user
        done(null, user.id);
    });
    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((userId, done) => {
        User.findByPk(userId)
            .then((user) => {
                console.log("Login! 3")
                done(null, user);
                // user object saved in req.session / saved in req.session.passport.user => req.user.{}
            })
            .catch((done) => {
                // No user found, not stored in req.session
                console.log(done);
            });
    });
}
module.exports = { localStrategy };