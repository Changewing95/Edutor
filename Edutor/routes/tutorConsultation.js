const express = require('express');
const Consultation = require('../models/Booking');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');

// ROUTING: 
// route to catalogue for consultation
router.get('/main', (req, res) => {
    res.render('tutor/consultation');
});

// route to form field -- add slot
router.get('/create', (req, res) => {
    res.render('tutor/addConsultation');
});



// CODING LOGIC (CRUD)
// to-do: add in 'ensure 
router.post('/create', async function (req, res) {
    let { title, image, description, date, start_time, end_time } = req.body;

    const message = 'Consultation slot successfully submitted';
    flashMessage(res, 'success', message);

    let consultation = await Consultation.create({ title, image, description, date, start_time, end_time });

    // IMAGE UPLOAD: TO-FIX
    // Creates user id directory for upload if not exist
    // if (!fs.existsSync('./public/uploads/' + 1)) {
    //     fs.mkdirSync('./public/uploads/' + 1, {
    //         recursive:
    //             true
    //     });
    // }
    // upload(req, res, (err) => {
    //     if (err) {
    //         // e.g. File too large
    //         res.json({ file: '/img/no-image.jpg, err:err' });
    //     }
    //     else {
    //         res.json({ file: `/uploads/$req.user.id/${req.file.filename}` });
    //     }
    // });


    res.redirect('/');
});


module.exports = router;