const express = require('express');
const router = express.Router();
const User = require('../models/User')
const flashMessage = require('../helpers/messenger');
const UserController = require('../Controller/User');
const Consultation = require('../models/Booking');
const FileUpload = require('../helpers/imageUpload');
const ensureAuthenticated = require('../helpers/checkAuthentication');
const { nextTick } = require('process');
const resolve = require('path').resolve;
const fs = require('fs');
var uuid = require('uuid');
const { pipeline } = require('stream');
const app = express();


// for video conference
const server = require("http").Server(app); 	// for socket.io
const io = require("socket.io")(server);		// for socket.io
const stream = require('../public/js/stream');

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
    var profile_id = uuid.v1();
    User.update({
        profile_pic: profile_id
    }, { where: { id: req.user.id } }).then(() => {
        res.redirect('settings');
    }).catch((errors) => {
        console.log(errors);
    })

    pipeline(req, fs.createWriteStream(resolve(`./public/images/profilepictures/${profile_id}.png`)), (error) => {
        if (!error) {
            res.send("succaess");
        }
    });
})



router.get('/display', async (req, res) => {
    // await User.findOne({ where: { id: req.user.id } }).then((user) => {
    //     if (user) {
    //         console.log(user.profile_pic);
    //         res.sendFile(resolve(`./public/images/profilepictures/${user.profile_pic}.png`))
    //     } else {
    //         res.send("no access");
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // })
    res.sendFile(resolve(`./public/images/profilepictures/${req.user.profile_pic}.png`))


});


// router.get('/vidroom/:id', ensureAuthenticated, function (req, res) {
//     Consultation.findByPk(req.params.id)
//         .then((consultation) => {
//             if (!consultation) {
//                 flashMessage(res, 'error', 'Consultation not found');
//                 res.redirect('/dashboard/settings');
//                 return;
//             }
//             if (req.user.id != consultation.userId) {
//                 flashMessage(res, 'error', 'Unauthorised access');
//                 res.redirect('/dashboard/settings');
//                 return;
//             }

//             res.render('consultation/callroom', { consultation });
//         })
//         .catch(err => console.log(err));
//     // res.render("consultation/callroom");
// })


// router.get('/consultation', ensureAuthenticated, (req, res) => {
//     Consultation.findAll({
//         where: { userId: req.user.id },
//         order: [['date']],
//         raw: true
//     })
//         .then((consultations) => {
//             // pass object to consultation.hbs
//             res.render('dashboard/dashboardOverview', { consultations, layout: 'main2' });
//         })
//         .catch(err => console.log(err));
//     // res.render('tutor/consultation');
// });

// io.of('/stream').on('connection', stream);



module.exports = router;
