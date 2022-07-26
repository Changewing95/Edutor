const { json } = require('body-parser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');

let student = "student";

exports.validate = (method) => {
    switch(method) {
        case 'Validation': {
            return [
                body('password').isLength({min: 5})
                .withMessage('must be at least 5 chars long')
            ]
        }

    }
}

exports.AuthoriseUser = async(req, res, next) => {
    try {
        const errors = validationResult(req); // FInds the validation
        if(!errors.isEmpty()) {
            // res.status(422.).json({errors: errors.array() });
            errors.array().forEach(error => {
                console.log(error)
                flashMessage(res, 'error', error.msg)
                next()
                // console.log(flashMessage(res, 'error', error.msg))
                // console.log(error)
                // return res.send(error.msg)
            })
            return

            // console.log(res.status(422).json(errors.msg))
            // res.render('home', {errors: errors.msg});
        }
        // console.log("next")
        next()
        // return true
    } catch(err) {
        // console.log(errr)
        return next(err)
    }
}


exports.CreateUser = async(req,res) => {
    let {name, email, password} = req.body;
    try {
        let user = await User.findOne({where: {email: email}});
        if (user) {
            res.send("Alright registered")
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            let user = await User.create({name, email, password: hash, roles: student})
            res.send("registered!")
        }
    } catch(err) {
        res.send("Error")
        console.log(err)
    }
}




