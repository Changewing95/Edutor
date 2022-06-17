const express = require('express');
const router = express.Router();
const User = require('../models/User')
const flashMessage = require('../helpers/messenger');
const UserController = require('../Controller/User');
router.get('/overview', (req, res) => {
    res.render('dashboard/overview', {layout: 'main2', currentpage: {overview: true}});
});


// CRUD FEATURE FOR USER EDITING


// READ
router.get('/settings', async (req, res) => {
    let user = await User.findOne({ where: { id: req.user.id } });
    res.render('dashboard/settings', {layout: 'main2', currentpage: {settings: true}, name:user.name, email: user.email});
});


//  DELETE
router.get('/settings/delete_student', UserController.DeleteUser);



// UPDATE
router.post('/settings', UserController.CheckIfUserExists, UserController.UpdateUser);



module.exports = router;
