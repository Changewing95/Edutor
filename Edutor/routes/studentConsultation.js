const express = require('express');
const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
const Consultation = require('../models/Booking');


// ROUTING: 
// route to catalogue for consultation
router.get('/listConsultations', ensureAuthenticated, (req, res) => {
    Consultation.findAll({
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



module.exports = router;