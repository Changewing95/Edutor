const express = require('express');
const router = express.Router();
const User = require('../models/User')
const flashMessage = require('../helpers/messenger');
const UserController = require('../Controller/User');
const FileUpload = require('../helpers/imageUpload');
const ensureAuthenticated = require('../helpers/checkAuthentication');
const { nextTick } = require('process');
const resolve = require('path').resolve;
const fs = require('fs');
var uuid = require('uuid');
const { pipeline } = require('stream');


router.get('/overview', ensureAuthenticated, (req, res) => {
    res.render('dashboard/overview', { layout: 'main2', currentpage: { overview: true } });
});


// CRUD FEATURE FOR USER EDITING


// READ
router.get('/settings', ensureAuthenticated, async (req, res) => {
    await User.findOne({ where: { id: req.user.id } }).then((user) => {
        res.render('dashboard/settings', { layout: 'main2', currentpage: { settings: true }, name: user.name, email: user.email });
    })
});


//  DELETE
router.get('/settings/delete_student', ensureAuthenticated, UserController.DeleteUser);



// UPDATE
router.post('/settings', ensureAuthenticated, UserController.CheckIfUserExists, UserController.UpdateUser);


// PROFILE PICTURE UPLOAD // Advanced Feature - JEREMY
router.put('/profilePictureUpload', async (req, res) => {
    // Creates user id directory for upload if not exist
    // FileUpload(req, res, (err) => {
    //     if (err) {
    //         console.log("error1")
    //         res.json({ file: '/img/no-image.jpg', err: err });
    //     } else {
    //         console.log(req.file);
    //         if (req.file === undefined) {
    //             console.log("error2")
    //             res.json({ file: '/img/no-image.jpg', err: err });
    //         } else {
    //             console.log("success")
    //             res.json({ file: `${req.file.filename}` });
    //             User.update({
    //                 profile_pic: req.file.filename
    //             }, { where: { id: req.user.id } }).then(() => {
    //                 res.redirect('settings');
    //             }).catch((errors) => {
    //                 console.log(errors);
    //             })
    //         }
    //     }
    // });
    // var id = uuid.v4();
    // User.update({
    //     profile_pic: id
    // }, { where: { id: req.user.id } }).then(() => {
    //     res.redirect('settings');
    // }).catch((errors) => {
    //     console.log(errors);
    // })
    // req.pipe(fs.createWriteStream(resolve(`./public/images/profilepictures/${req.user.id}.png`)))
    pipeline(req, fs.createWriteStream(resolve(`./public/images/profilepictures/${req.user.id}.png`)), (error) => {
        if(!error) {
            res.send("success")
        } else {
            res.send(error);
        }
    });
})



router.get('/display', async (req, res) => {
    let user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
        console.log(user);
        res.sendFile(resolve(`./public/images/profilepictures/${req.user.id}.png`))
    } else {
        res.send("no access");
    }
});






module.exports = router;
