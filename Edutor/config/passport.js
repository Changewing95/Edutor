const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const speakeasy = require('speakeasy')


function localStrategy(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email', passReqToCallback: true, }, function (req, email, password, done) {
            User.findOne({ where: { email: email } })
                .then(user => {
                    const otp_verified = speakeasy.totp.verify({
                        secret: user.otp,
                        encoding: 'ascii',
                        token: req.body.otp
                    })
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
                    } else if (user.verified == "no") {
                        return done(null, false, {
                            message: 'Account not verified! Verify through your email!'
                        });
                    } else if (!otp_verified) {
                        return done(null, false, {
                            message: 'Incorrect one time password! Please check and re-type'
                        });
                    }
                    else {
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
                done(null, user);
                // user object saved in req.session / saved in req.session.passport.user => req.user.{}
            })
            .catch((done) => {
                // No user found, not stored in req.session
            });
    });
}
module.exports = { localStrategy };