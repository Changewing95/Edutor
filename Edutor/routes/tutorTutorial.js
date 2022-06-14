const express = require('express');
const router = express.Router();
// const moment = require('moment');
// const Tutorial = require('../models/Tutorial');
// const ensureAuthenticated = require('../helpers/auth');

router.get('/main', (req, res) => {
    res.render('tutor/tutorial');
});

router.get('/create', (req, res) => {
    res.render('tutor/addTutorial');
});
module.exports = router;
