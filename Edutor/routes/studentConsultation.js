const moment = require('moment');
const express = require('express');
const router = express.Router();
const Consultation = require('../models/Booking');
const flashMessage = require('../helpers/messenger');
// for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');
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



// CODING LOGIC (CRUD)



module.exports = router;