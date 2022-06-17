const express = require('express');
const router = express.Router();
// const fs = require('fs');
const Consultation = require('../models/Booking');
const flashMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');

// const upload = require('../helpers/imageUpload');
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
            res.render('tutor/consultation', { consultations });
        })
        .catch(err => console.log(err));
    // res.render('tutor/consultation');
});

// route to form field -- add slot
router.get('/create', (req, res) => {
    res.render('tutor/addConsultation');
});



// CODING LOGIC (CRUD)
// CREATE
router.post('/create', async function (req, res) {
    let { title, image, price, description, date, start_time, end_time } = req.body;

    const message = 'Consultation slot successfully submitted';
    flashMessage(res, 'success', message);

    let consultation = await Consultation.create({ title, image, price, description, date, start_time, end_time });


    res.redirect('/tutor/consultation/main');
});

// profile picture upload
router.post('/consultationImage', function (req, res) {
    // Creates user id directory for upload if not exist
    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `${req.file.filename}` });
            }
        }
    });
})



module.exports = router;