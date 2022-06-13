const { json } = require('body-parser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');
const Email = require('../config/mail');
var uuid = require('uuid');

let student = "student";
let tutor = "tutor";

exports.validate = (method) => {
    switch (method) {
        case 'Validation': {
            return [
                body('email').isEmail().withMessage('Please provide an email address'),
                body('password').isLength({ min: 5 })
                    .withMessage('Password must be at least 5 chars long'),
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
                console.log(error)
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
    let { email } = req.body;
    try {
        let user = await User.findOne({ where: { email: email } });
        if(user.verified == "yes") {
            console.log(user.verified);
            next()
        } else {
        flashMessage(res, 'error', "Account not verified! Verify through your email!")
        return res.render(`auth/registration${req.path}`);
        }
    } catch (err) {
        console.log(err);
    }
};



exports.CreateUser = async (req, res) => {
    let { name, email, password, confirm_password } = req.body;
    console.log()
    try {
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            flashMessage(res, 'error', "Student Already Registered!")
            return res.render('auth/registration/register_user');
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            let user = await User.create({ name, email, password: hash, confirm_password, roles: student })
            Email.sendMail(email, user.verification_code).then((result) => {
                console.log(result)
            }).catch((error) => {
                console.log(error)
            });
            flashMessage(res, 'success', "Student Successfully Registered! Please proceed to verify your email")
            return res.render('auth/registration/register_user');
        }
    } catch (err) {
        res.send("Error")
        console.log(err)
    }
}


exports.CreateTutor = async (req, res) => {
    let { name, email, password, confirm_password } = req.body;
    console.log()
    try {
        let user = await User.findOne({ where: { email: email } });
        if (user) {
            flashMessage(res, 'error', "Tutor Already Registered!")
            return res.render('auth/registration/register_tutor');
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            let user = await User.create({ name, email, password: hash, confirm_password, roles: tutor })
            flashMessage(res, 'success', "Tutor Successfully Registered! Please proceed to verify your email")
            return res.render('auth/registration/register_tutor');
        }
    } catch (err) {
        res.send("Error")
        console.log(err)
    }
}



