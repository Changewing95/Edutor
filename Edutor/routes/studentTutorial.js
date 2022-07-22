const express = require('express');
const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
// const moment = require('moment');
const Tutorial = require('../models/Tutorial');
// const fs = require('fs');
// const upload = require('../helpers/uploadImage');

<<<<<<< HEAD
=======

>>>>>>> master
router.get('/main', ensureAuthenticated, (req, res) => {
    Tutorial.findAll({
        
        raw: true
    })
        .then((tutorials) => {
            // pass object to listVideos.handlebar
<<<<<<< HEAD
            console.log(tutorials);
=======
>>>>>>> master
            res.render('tutor/studentTutorial', { tutorials });
        })
        .catch(err => console.log(err));
});

<<<<<<< HEAD
=======
router.get('/display/:id', (req, res) => {

    Tutorial.findByPk(req.params.id)
        .then((tutorials) => {
            res.render('tutor/studentDetailedTutorial', { tutorials });
        })
        .catch(err => console.log(err));
});

router.get('/get-video/:userId/:fileName', async (req, res) => {
    // res.sendFile(`uploads/${id}/${req.params.fileName}`, { root: 'public' })
    // await Tutorial.findByPk(req.params.fileName)
    //     let tut = await Tutorial.findByPk
    //     // .then((tutorials) => {
    //         console.log(tut)
    //         console.log(req.params.fileName)
            // res.sendFile(`uploads/${tutorials.userId}/${req.params.fileName}`, { root: 'public' })
        // .catch(err => console.log(err));
    console.log(req.params.userId);
    res.sendFile(`uploads/${req.params.userId}/${req.params.fileName}`, { root: 'public' })
})
>>>>>>> master

module.exports = router;

