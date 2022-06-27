const { json } = require('body-parser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const flashMessage = require('../helpers/messenger');
const bcrypt = require('bcryptjs');



exports.DeleteUser = async (req, res) => {
    User.destroy({
        where: { "id": req.user.id }
    }).then(() => {
        flashMessage(res, 'success', "Account deleted!")
        req.logout();
        res.redirect('/');
    })
}



exports.UpdateUser = async (req, res) => {
    var isValid = true;
    let getUser = await User.findOne({ where: { email: req.body.email } });
    let { name, email, password, confirm_password } = req.body;
    if (name.length > 0 && email.length > 0 && password.length > 0 && confirm_password.length > 0) {
        if (password.length < 5 || confirm_password.length < 5) {
            flashMessage(res, 'error', 'Password must be at least 5 characters');
            isValid = false;
        }
        else if (password != confirm_password) {
            flashMessage(res, 'error', 'Password does not match confirmation_password');
            isValid = false;
        }
        else if (getUser) {
            flashMessage(res, 'error', 'Email is already in use!');
            isValid = false;
        }
        if (!isValid) {
            res.redirect('settings');
            return;
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            User.update({
                name: name,
                email: email.toLowerCase(),
                password: hash
            }, { where: { id: req.user.id } }).then(() => {
                flashMessage(res, 'success', "Information changed successfully!", 'fas fa-sign-in-alt', true);
                res.redirect('settings');
            }).catch((errors) => {
                console.log(errors);
            })
        }
    } else {
        flashMessage(res, 'success', "No Changes! Please fulfill all the above fields", 'fas fa-sign-in-alt', true);
        res.redirect('settings');
    }

}




exports.CheckIfUserExists = async (req, res, next) => {
    // if(name && email && password && confirm == )
    let user = await User.findOne({ where: { email: email } });
    if (user) {
        flashMessage(res, 'error', "Account already exists!", 'fas fa-sign-in-alt', true);
        res.redirect('settings')
    } else {
        next()
    }

}



function CheckifPasswordIsTheSame(res, req, password, confirm_password) {
    if (password != confirm_password) {
        flashMessage(res, 'error', "Password is not the same!", 'fas fa-sign-in-alt', true);
        res.redirect('settings')
    }
}
