const express = require('express');
const router = express.Router();
const User = require('../models/User')
const UserController = require('../Controller/validate');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const flashMessage = require('../helpers/messenger');


router.get('/login', (req,res) => {
	res.render('auth/registration/login', {currentpage: {
		login: true
	}});
});



// Three middleware for login post to check requirements and to authorised user and lastly passport authenticate middleware to authorise user access
router.post('/login', UserController.validate('Validation'), UserController.AuthoriseUser,passport.authenticate('local', {failureRedirect: 'login', failureFlash : true}), UserController.CheckIfVerified, (req,res) => {
	flashMessage(res, 'success', 'Successfully login!')
	res.redirect('/');
});




//  Getting the route register that contains buttons to both tutor and student
router.get('/register', (req, res) => {
	// renders views/index.handlebars, passing title as an object
	res.render('auth/registration/register', {currentpage: {register: true}})
});




//  Getting student registration page

router.get('/register_user',(req,res) => {
	console.log("h");
	res.render('auth/registration/register_user', {currentpage: {register: true}})

});

router.post('/register_user', UserController.validate('Validation'), UserController.AuthoriseUser, UserController.CreateUser);





//  Getting Tutor registration page

router.get('/register_tutor',(req,res) => {

	res.render('auth/registration/register_tutor', {currentpage: {register: true}})

});

//  Posting Tutor

router.post('/register_tutor', UserController.validate('Validation'), UserController.AuthoriseUser, UserController.CreateTutor);



router.get('/validate/:id', async (req,res) => {
	let id = req.params.id
	let user = await User.findOne({ where: { verification_code: id } });
	if(user) {
		user.update({verified: "yes"})
		console.log(user);
		console.log(user.verified);
	}
	res.redirect('/');

});





module.exports = router;
