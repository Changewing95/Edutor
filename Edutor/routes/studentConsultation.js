const express = require('express');
const router = express.Router();
const Consultation = require('../models/Booking');
const flashMessage = require('../helpers/messenger');
// for validation
// const ensureAuthenticated = require('../helpers/auth');

// ROUTING: 
// route to catalogue for consultation
router.get('/listConsultations', (req, res) => {
    Consultation.findAll({
        // where: { userId: req.user.id },
        order: [['date']],
        raw: true
    })
        .then((consultations) => {
            // pass object to consultation.hbs
            res.render('consultation/studentConsultation', { consultations });
        })
        .catch(err => console.log(err));
});

// display detailed information of slot detail
router.get('/display/:id', (req, res) => {

    Consultation.findByPk(req.params.id)
        .then((consultation) => {
            res.render('consultation/detailedConsultation', { consultation });
        })
        .catch(err => console.log(err));
});


// CODING LOGIC (CRUD)



module.exports = router;