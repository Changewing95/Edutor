const { json } = require('body-parser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const flashMessage = require('../helpers/messenger');
const bcrypt = require('bcryptjs');
const Email = require('../config/mail');
const procyon = require('procyon')
const OrderItems = require('../models/OrderItems');
const sequelize = require('sequelize');
const { response } = require('express');
const Tutorial = require('../models/Tutorial');
const UserController = require('../Controller/User');



exports.DeleteUser = async (req, res) => {
    User.destroy({
        where: { "id": req.user.id }
    }).then(() => {
        flashMessage(res, 'success', "Account deleted!")
        req.logout();
        res.redirect('/');
    })
}

function IsUserEmailValid(getUser) {
    if (getUser) {
        return false
    } else {
        return true
    }

}

function IsUserUsernameValid(username) {
    return true
}


function IsUserPasswordValid(password, cfm_password) {
    if (password.length < 5 || cfm_password.length < 5) {
        return false
    } else if (password != cfm_password) {
        return false
    } else {
        return true
    }
}



exports.UpdateUser = async (req, res) => {
    var isValid = true;
    let getUser = await User.findOne({ where: { email: req.body.email } });
    let { name, email, password, confirm_password } = req.body;

    if (name.length > 0 || email.length > 0 || password.length > 0 || confirm_password.length > 0) {

        if (name.length > 0) {
            if (IsUserUsernameValid(name)) {
                await User.update({
                    name: name
                }, { where: { id: req.user.id } })
            } else {
                isValid = false;
                flashMessage(res, 'error', 'Error, username must have more than one character');
            }
        }


        if (password.length > 0 || confirm_password.length > 0) {
            if (IsUserPasswordValid(password, confirm_password)) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                await User.update({
                    password: hash
                }, { where: { id: req.user.id } })
            } else {
                isValid = false;
                flashMessage(res, 'error', 'Error, ensure that password matches and is more than 5 characters');
            }
        }

        if ((email.length > 0)) {
            if (IsUserEmailValid(getUser)) {
                await User.update({
                    email: email.toLowerCase(),
                    verified: "no"
                }, { where: { id: req.user.id } }).then(() => {
                    Email.sendMail(email, req.user.verification_code).then((result) => {
                        console.log(result)
                    }).catch((error) => {
                        console.log(error)
                    });
                });
            } else {
                isValid = false;
                flashMessage(res, 'error', 'User already exists Please choose another email address');

            }
        }

        if (!isValid) {
            res.redirect('settings');
            return;
        } else if (req.user.verified == "no") {
            flashMessage(res, 'success', "Email changed successfully! Please re-verify in your inbox", 'fas fa-sign-in-alt', true);
            res.redirect('/logout');
            return
        } else {
            flashMessage(res, 'success', "Information changed successfully!", 'fas fa-sign-in-alt', true);
            res.redirect('settings');
            return;
            // res.redirect('/logout');
        }
    } else {
        flashMessage(res, 'success', "No changes!", 'fas fa-sign-in-alt', true);
        res.redirect('settings');
        return;

    }


    // if (name.length > 0) {
    //     User.update({
    //         name: name
    //     }, { where: { id: req.user.id } })
    // }
    // if (email.length > 0) {
    //     if (getUser) {
    //         flashMessage(res, 'error', 'Email is already in use!');
    //         isValid = false;
    //     } else {
    //         User.update({
    //             email: email.toLowerCase()
    //         }, { where: { id: req.user.id } })
    //     }
    // }
    // if (password.length < 5 || confirm_password.length < 5) {
    //     flashMessage(res, 'error', 'Password must be at least 5 characters');
    //     isValid = false;
    // }
    // else if (password != confirm_password) {
    //     flashMessage(res, 'error', 'Password does not match confirmation_password');
    //     isValid = false;
    // }
    // else {
    //     var salt = bcrypt.genSaltSync(10);
    //     var hash = bcrypt.hashSync(password, salt);
    //     User.update({
    //         password: hash
    //     }, { where: { id: req.user.id } })
    // }
}

// if (!isValid) {
//     res.redirect('settings');
//     return;
// } else {
//     flashMessage(res, 'success', "Information changed successfully!", 'fas fa-sign-in-alt', true);
//     res.redirect('/logout');
// }


// if (name.length > 0 && email.length > 0 && password.length > 0 && confirm_password.length > 0) {
//     if (password.length < 5 || confirm_password.length < 5) {
//         flashMessage(res, 'error', 'Password must be at least 5 characters');
//         isValid = false;
//     }
//     else if (password != confirm_password) {
//         flashMessage(res, 'error', 'Password does not match confirmation_password');
//         isValid = false;
//     }
//     else if (getUser) {
//         flashMessage(res, 'error', 'Email is already in use!');
//         isValid = false;
//     }
//     if (!isValid) {
//         res.redirect('settings');
//         return;
//     } else {
//         var salt = bcrypt.genSaltSync(10);
//         var hash = bcrypt.hashSync(password, salt);
//         User.update({
//             name: name,
//             email: email.toLowerCase(),
//             password: hash,
//         }, { where: { id: req.user.id } }).then((userObject) => {
//             console.log(userObject);
//             flashMessage(res, 'success', "Information changed successfully!", 'fas fa-sign-in-alt', true);
//             res.redirect('/logout');
//         }).catch((errors) => {
//             console.log(errors);
//         })
//     }
// } else {
//     flashMessage(res, 'success', "No Changes! Please fulfill all the above fields", 'fas fa-sign-in-alt', true);
//     res.redirect('settings');
// }





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



exports.Recommendation = async (req, res) => {
    var Student1 = new procyon({
        className: 'Users'
    });
    AllItems = await OrderItems.findAll({
        where: { cust_id: req.user.id },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('prod_name')), 'prod_name']]
    });

    if (AllItems.length > 0) {
        for await (const variable of AllItems) {
            console.log(variable['prod_name'])
            Student1.liked(req.user.id, variable['prod_name'])
        }
        let recommendations_actors = await Student1.recommendFor(req.user.id, 10)
        console.log(recommendations_actors)
        if (recommendations_actors.length > 0) {
            let results = await Tutorial.findAll({
                raw: true,
                where: {
                    title: {
                        [sequelize.Op.or]: recommendations_actors
                    }
                }
            });
            return results;
        } else {
            return "false"
        }
    } else {
        return "false"
    }

}