const express = require('express');
const router = express.Router();
const User = require('../models/User')
const flashMessage = require('../helpers/messenger');

router.get('/overview', (req, res) => {
    res.render('dashboard/overview', {layout: 'main2'});
});


// Testing 123






module.exports = router;
