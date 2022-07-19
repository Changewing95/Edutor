const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const app = express();
const Consultation = require('../models/Booking');




router.get('/', (req, res) => {
	const title = 'Video Jotter';
	// renders views/index.handlebars, passing title as an object
	res.render('home', {
		title: title
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


// for video conference
const server = require("http").Server(app); 	// for socket.io
const io = require("socket.io")(server);		// for socket.io
const stream = require('../public/js/stream');

router.get('/vidroom/:id', function (req, res) {
	Consultation.findByPk(req.params.id)
		.then((consultation) => {
			if (!consultation) {
				flashMessage(res, 'error', 'Consultation not found');
				res.redirect('/tutor/consultation/settings');
				return;
			}
			if (req.user.id != consultation.userId) {
				flashMessage(res, 'error', 'Unauthorised access');
				res.redirect('/tutor/consultation/settings');
				return;
			}

			res.render('consultation/callroom', { consultation });
		})
		.catch(err => console.log(err));
	// res.render("consultation/callroom");
})


io.of('/stream').on('connection', stream);

module.exports = router;
