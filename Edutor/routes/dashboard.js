const express = require('express');
const router = express.Router();
const User = require('../models/User')
const flashMessage = require('../helpers/messenger');
const UserController = require('../Controller/User');
const FileUpload = require('../helpers/imageUpload');
const ensureAuthenticated = require('../helpers/checkAuthentication');
const resolve = require('path').resolve;

router.get('/overview', ensureAuthenticated, (req, res) => {
    res.render('dashboard/overview', { layout: 'main2', currentpage: { overview: true } });
});


// CRUD FEATURE FOR USER EDITING


// READ
router.get('/settings', ensureAuthenticated, async (req, res) => {
    let user = await User.findOne({ where: { id: req.user.id } });
    res.render('dashboard/settings', { layout: 'main2', currentpage: { settings: true }, name: user.name, email: user.email });
});


//  DELETE
router.get('/settings/delete_student', ensureAuthenticated, UserController.DeleteUser);



// UPDATE
router.post('/settings', ensureAuthenticated, UserController.CheckIfUserExists, UserController.UpdateUser);


// PROFILE PICTURE UPLOAD
router.post('/profilePictureUpload', (req, res) => {
    // Creates user id directory for upload if not exist
    FileUpload(req, res, (err) => {
        if (err) {
            console.log("error1")
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                console.log("error2")
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                console.log("success")
                res.json({ file: `${req.file.filename}` });
                User.update({
                    profile_pic: req.file.filename
                }, { where: { id: req.user.id } }).then(() => {
                    res.redirect('settings');
                }).catch((errors) => {
                    console.log(errors);
                })
            }
        }
    });
})



router.get('/display', async (req,res) => {
    let user = await User.findOne({ where: { id: req.user.id } });
    if(user) {
        console.log(user);
        res.sendFile(resolve(`./images/profilepictures/${user.profile_pic}`))
    } else {
        res.send("no access");
    }
}); 





module.exports = router;
