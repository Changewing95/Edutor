const express = require('express');
// const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
// const moment = require('moment');
const Tutorial = require('../models/Tutorial');
// const fs = require('fs');
// const upload = require('../helpers/uploadImage');

router.get('/main', (req, res) => {
    Tutorial.findAll({
        
        raw: true
    })
        .then((tutorials) => {
            // pass object to listVideos.handlebar
            res.render('tutor/studentTutorial', { tutorials });
        })
        .catch(err => console.log(err));
});


module.exports = router;

