const express = require('express');
const Consultation = require('../models/Booking');
const router = express.Router();
const flashMessage = require('../helpers/messenger');

router.get('/main', (req, res) => {
    res.render('tutor/consultation');
});
router.get('/create', (req, res) => {
    res.render('tutor/addConsultation');
});

router.post('/create', async function (req, res) {
    // let title = req.body.title;
    // let description = req.body.description.slice(0, 1999);
    // let date = moment(req.body.date, 'DD/MM/YYYY');
    // let start_time = moment(req.body.start_time, 'HH:mm');
    // let end_time = moment(req.body.end_time, 'HH:mm');
    // let userId = req.user.id;

    let { title, image, description, date, start_time, end_time } = req.body;

    const message = 'Consultation slot successfully submitted';
    flashMessage(res, 'success', message);

    // Consultation.create({
    //     title, description, date, start_time, end_time, userId
    // })
    //     .then((consultation) => {
    //         console.log(video.toJSON());
    //         res.redirect('/feedback/feedback');
    //     })
    //     .catch(err => console.log(err))

    let consultation = await Consultation.create({ title, image, description, date, start_time, end_time });

    res.redirect('/');
});

module.exports = router;