const express = require('express');
const router = express.Router();
const User = require('../models/User')
const flashMessage = require('../helpers/messenger');

router.get('/overview', (req, res) => {
    res.render('dashboard/overview', {layout: 'main2', currentpage: {overview: true}});
});


router.get('/settings', (req, res) => {
    res.render('dashboard/settings', {layout: 'main2', currentpage: {settings: true}});
});



//  DELETE
router.get('/settings/delete_student', async (req, res) => {
    User.destroy({
        where: {"id" : req.user.id}
    }).then(() => {
        flashMessage(res, 'success', "Account deleted!")
        req.logout();
        res.redirect('/');
    })
});


module.exports = router;
