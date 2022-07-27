const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
// const app = express();
const Consultation = require('../models/Booking');
const ensureAuthenticated = require('../helpers/checkAuthentication');
const Tutorial = require('../models/Tutorial')
const User = require('../models/User')
const Procyon = require('procyon')
const { Op } = require("sequelize");



router.get('/', async (req, res) => {
	const title = "Edutor"
	// var ListOfTut = await Tutorial.findAll({
	// 	where: {
	// 	  title: {
	// 		[Op.or]: JSON.parse(req.user.interest)
	// 	  }
	// 	}
	//   })
	//   console.log(ListOfTut)
	// renders views/index.handlebars, passing title as an object
	res.render('home', { title: title })
});


router.get('/recommender', ensureAuthenticated, async (req, res) => {
	User.update({ isNew: "no" }, { where: { id: req.user.id } })
	await Tutorial.findAll().then((tutorial) => {
		res.render('recommender', { categories: tutorial, layout: null })
	});

});


router.post('/recommender', async (req, res) => {
	let { package } = req.body;
	// console.log(package);
	var Student = new Procyon({
		className: 'user'
	})

	for (var i in package) {
		let name = package[i]
		await Student.liked(req.user.id, name)
		// console.log(package[i]);
	}
	await Student.recommendFor(req.user.id, 10).then((recommendation) => {
		var results = JSON.stringify(recommendation);
		User.update({
			interest: results
		}, { where: { id: req.user.id } }).then(() => {
			res.redirect('/')
		}).catch((errors) => {
			console.log(errors);
		})

	})

});










router.post('/flash', (req, res) => {
	const message = 'This is an important message';
	const error = 'This is an error message';
	const error2 = 'This is the second error message';
	// req.flash('message', message);
	// req.flash('error', error);
	// req.flash('error', error2);
	flashMessage(res, 'success', message);
	flashMessage(res, 'info', message);
	flashMessage(res, 'error', error);
	flashMessage(res, 'error', error2, 'fas fa-sign-in-alt', true);
	res.redirect('/');
});

// Log out  + it clears the sessions of the users
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


// // for video conference
// const server = require("http").Server(app); 	// for socket.io
// const io = require("socket.io")(server);		// for socket.io
// const stream = require('../public/js/stream');

router.get('/vidroom/:id', ensureAuthenticated, function (req, res) {
	Consultation.findByPk(req.params.id)
		.then((consultation) => {
			if (!consultation) {
				flashMessage(res, 'error', 'Consultation not found');
				res.redirect('/tutor/consultation/settings');
				return;
			}

			res.render('consultation/callroom', { consultation });
		})
		.catch(err => console.log(err));
	// res.render("consultation/callroom");
})


// io.of('/stream').on('connection', stream);

module.exports = router;
