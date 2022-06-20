const moment = require('moment');
const express = require('express');
const router = express.Router();
const Consultation = require('../models/Booking');
const flashMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const { start } = require('repl');

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
            res.render('consultation/consultation', { consultations });
        })
        .catch(err => console.log(err));
    // res.render('tutor/consultation');
});

// route to form field -- add slot
router.get('/create', (req, res) => {
    res.render('consultation/addConsultation');
});



// CODING LOGIC (CRUD)
// CREATE
router.post('/create', async function (req, res) {
    let title = req.body.title;
    let consultationURL = req.body.consultationURL;
    let price = req.body.price;
    let description = req.body.description;
    let start_time = req.body.start_time;
    let end_time = req.body.end_time;
    let date = moment(req.body.consultDate, 'DD/MM/YYYY');

    const message = 'Consultation slot successfully submitted';
    flashMessage(res, 'success', message);

    let consultation = await Consultation.create({ title, consultationURL, price, description, date, start_time, end_time })
    // .then((consultation) => {
    //     console.log(video.toJSON());
    //     res.redirect('/video/listVideos');
    // })
    // .catch(err => console.log(err));


    res.redirect('/tutor/consultation/main');
});

router.post('/upload', (req, res) => {
    // create user id directory for upload if not exist
    /* change 1 to req.user.id */
    if (!fs.existsSync('./public/uploads/' + 1)) {
        fs.mkdirSync('./public/uploads/' + 1, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/img/no-image.jpg', err: err });
        }
        else {
            /* change 1 to req.user.id */
            res.json({
                file: `/uploads/1/${req.file.filename}`
            });
        }
    });
});


module.exports = router;