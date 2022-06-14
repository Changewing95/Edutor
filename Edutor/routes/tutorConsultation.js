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
// to-do: add in 'ensure 
// CODING LOGIC (CUD)
// CREATE
// to-do: add in 
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
=======
    res.redirect('main');
});


module.exports = router;