const { json } = require('body-parser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');
const Email = require('../config/mail');
var uuid = require('uuid');
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')




let student = "student";
let tutor = "tutor";

exports.validate = (method, req, res) => {
    switch (method) {
        case 'Register_Validation': {
            return [
                body('password').isLength({ min: 5 }).withMessage("Password must be more than 5"),
                body('email').custom(value => {
                    return User.findOne({ where: { email: value } }).then(user => {
                        if (user) {
                            throw new Error('Email already registered! Please use a different email address');
                        }
                    })
                }),
                body('confirm_password').custom((value, { req }) => {
                    if (value != req.body.password) {
                        throw new Error('Password confirmation does not match password');
                    }
                    return true;


                })

            ]
        }
    }
}

exports.AuthoriseUser = async (req, res, next) => {
    // var fullPath = req.baseUrl + req.path;
    // console.log(fullPath)
    try {
        const errors = validationResult(req); // FInds the validation
        if (!errors.isEmpty()) {
            // res.status(422.).json({errors: errors.array() });
            errors.array().forEach(error => {
                flashMessage(res, 'error', error.msg)
            })
            return res.render(`auth/registration${req.path}`);
        }
        next()
        // Calling the next middlware function which is "Createuser"
    } catch (err) {
        return next(err)
    }
}





exports.CheckIfVerified = async (req, res, next) => {
    // let { email } = req.body;

    // try {
    //     let user = await User.findOne({ where: { email: email } });
    //     if (!user) {
    //         next()
    //     }
    //     else if (user.verified == "yes") {
    //         console.log(user.verified);
    //         next()
    //     } else {
    //         flashMessage(res, 'error', "Account not verified! Verify through your email!")
    //         return res.render(`auth/registration${req.path}`);
    //     }
    // } catch (err) {
    //     console.log(err);
    // }
};





exports.CreateUser = async (req, res, next) => {
    let { name, email, password, confirm_password } = req.body;
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        var secret = speakeasy.generateSecret({
            name: email
        })
        console.log(secret);
        let user = await User.create({ name, email, password: hash, roles: student, otp: secret.ascii })
        Email.sendMail(email, user.verification_code).then((result) => {
            console.log(result);
            var otp = qrcode.toDataURL(secret.otpauth_url, function (err, data) {
                res.render('auth/registration/google_authenticator', { currentpage: { register: true }, qrcode: data })
            });
            // flashMessage(res, 'success', "Student Successfully Registered! Please proceed to verify your email") 
        }).catch((error) => {
            console.log(error)
        });


        // return res.render('auth/registration/register_user');

    } catch (err) {
        res.send("Error")
        console.log(err)
    }
}


exports.CreateTutor = async (req, res) => {
    let { name, email, password, confirm_password } = req.body;
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        var secret = speakeasy.generateSecret({
            name: email
        })
        let user = await User.create({ name, email, password: hash, roles: tutor,  otp: secret.ascii })
        Email.sendMail(email, user.verification_code).then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        });
        var otp = qrcode.toDataURL(secret.otpauth_url, function (err, data) {
            res.render('auth/registration/google_authenticator', { currentpage: { register: true }, qrcode: data })

        });        // return res.render('auth/registration/register_tutor');
    }
    catch (err) {
        res.send("Error")
        console.log(err)
    }
}



exports.CreateAdmin = async (req, res) => {
    const user = "EdutorAdmin"
    const email = 'edutorow@gmail.com'
    const password = '+]k!h"`uQnY]'
    const admin = "admin"
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    var secret = speakeasy.generateSecret({
        name: email
    })
    let admin_account = User.create({ user, email, password: hash, verified: "yes", roles: admin, otp: secret.ascii })
    Email.sendMail(email, user.verification_code).then((result) => {
        // flashMessage(res, 'success', "Student Successfully Registered! Please proceed to verify your email") 
    }).catch((error) => {
        console.log(error)
    });
    var otp = qrcode.toDataURL(secret.otpauth_url, function (err, data) {
        res.render('auth/registration/google_authenticator', { currentpage: { register: true }, qrcode: data })

    });
}