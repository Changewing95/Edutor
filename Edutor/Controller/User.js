const { json } = require('body-parser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const flashMessage = require('../helpers/messenger');
const bcrypt = require('bcryptjs');



exports.DeleteUser = async (req, res) => {
    User.destroy({
        where: {"id" : req.user.id}
    }).then(() => {
        flashMessage(res, 'success', "Account deleted!")
        req.logout();
        res.redirect('/');
    })
}



exports.UpdateUser = (req, res) => {
    let {name, email, password, confirm_password} = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    CheckifPasswordIsTheSame(res, req, password, confirm_password)
    User.update({
        name: name,
        email: email,
        password: hash,
        confirm_password: confirm_password
    }, {where: {id: req.user.id}}).then(() => {
        res.redirect('settings');
    }).catch((errors) => {
        console.log(errors);
    })
}



exports.CheckIfUserExists = async (req,res,next) => {
    let {email} = req.body;
    let user = await User.findOne({ where: { email: email } });
    if(user) {
        flashMessage(res, 'error', "Account already exists!", 'fas fa-sign-in-alt', true);
        res.redirect('settings')
    } else {
        next()
    }

}



function CheckifPasswordIsTheSame(res, req, password, confirm_password) {
    if(password != confirm_password) {
        flashMessage(res, 'error', "Password is not the same!", 'fas fa-sign-in-alt', true);
        res.redirect('settings')
    }
}
