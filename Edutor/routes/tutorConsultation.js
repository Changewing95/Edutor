const moment = require('moment');
const express = require('express');
const router = express.Router();
const Consultation = require('../models/Booking');
const flashMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');

// const ensureAuthenticated = require('../helpers/auth');

// ROUTING: 
// route to catalogue for consultation
router.get('/main', (req, res) => {
    Consultation.findAll({
        // where: { userId: req.user.id },
        order: [['date']],
        raw: true
    })
        .then((consultations) => {
            // pass object to consultation.hbs
            res.render('consultation/consultation', { consultations });
        })
        .catch(err => console.log(err));
    // res.render('tutor/consultation');
});

// route to form field -- add slot
router.get('/create', (req, res) => {
    res.render('consultation/addConsultation');
});

// route to form field -- edit slot
router.get('/editConsultation/:id', (req, res) => {
    Consultation.findByPk(req.params.id)
        .then((consultations) => {
            res.render('consultation/editConsultation', { consultations });
        })
        .catch(err => console.log(err));
    /*
    Video.findByPk(req.params.id)
        .then((video) => {
            if (!video) {
                flashMessage(res, 'error', 'Video not found');
                res.redirect('/video/listVideos');
                return;
            }
            if (req.user.id != video.userId) {
                flashMessage(res, 'error', 'Unauthorised access');
                res.redirect('/video/listVideos');
                return;
            }

            res.render('video/editVideo', { video });
        })
        .catch(err => console.log(err));
        */
});



// CODING LOGIC (CRUD)
// CREATE
router.post('/create', async function (req, res) {
    let title = req.body.title;
    let consultationURL = req.body.consultationURL;
    let price = req.body.price;
    let description = req.body.description;
    let start_time = moment(req.body.start_time, 'HH:mm:ss');
    let end_time = moment(req.body.end_time, 'HH:mm:ss');
    let date = moment(req.body.consultDate, 'DD/MM/YYYY');

    const message = 'Consultation slot successfully submitted';
    flashMessage(res, 'success', message);

    let consultation = await Consultation.create({ title, consultationURL, price, description, date, start_time, end_time })
        .then((consultation) => {
            console.log(consultation.toJSON());
            res.redirect('/tutor/consultation/main');
        })
        .catch(err => console.log(err));
});

// EDIT
router.post('/editConsultation/:id', (req, res) => {
    let title = req.body.title;
    let consultationURL = req.body.consultationURL;
    let price = req.body.price;
    let description = req.body.description;
    let start_time = moment(req.body.start_time, 'HH:mm:ss');
    let end_time = moment(req.body.end_time, 'HH:mm:ss');
    let date = moment(req.body.consultDate, 'DD/MM/YYYY');



    Consultation.update(
        { title, consultationURL, price, description, date, start_time, end_time },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' consultation updated');
            res.redirect('/tutor/consultation/main');
        })
        .catch(err => console.log(err));
});


// DELETE
router.get('/deleteConsultation/:id', async function (req, res) {
    try {
        let consultation = await Consultation.findByPk(req.params.id);
        if (!consultation) {
            flashMessage(res, 'error', 'Consultation not found');
            res.redirect('/tutor/consultation/main');
            return;
        }
        /*
        if (req.user.id != video.userId) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/video/listVideos');
            return;
        }
        */

        let result = await Consultation.destroy({ where: { id: consultation.id } });
        console.log(result + ' consultation deleted');
        res.redirect('/tutor/consultation/main');
    }
    catch (err) {
        console.log(err);
    }
});




// image upload
router.post('/upload', (req, res) => {
    // create user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + 1)) {
        fs.mkdirSync('./public/uploads/' + 1, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/uploads/profile/profile.png', err: err });
        }
        else {
            res.json({
                file: `/uploads/1/${req.file.filename}`
            });
        }
    });

});





module.exports = router;