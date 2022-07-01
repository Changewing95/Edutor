const express = require('express');
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportConfig = require('./config/passport');
const bcrypt = require('bcryptjs');
passportConfig.localStrategy(passport);


const app = express();


// app.engine('handlebars', engine({
// 	handlebars: allowInsecurePrototypeAccess(Handlebars),
// 	defaultLayout: 'main' // Specify default template views/layout/main.handlebar
// }));
const helpers = require('./helpers/handlebars');
app.engine('hbs', engine({
	helpers: helpers,
	defaultLayout: 'main',
	extname: '.hbs',
	handlebars: allowInsecurePrototypeAccess(Handlebars),

}));
app.set('view engine', 'hbs');


// Express middleware to parse HTTP body in order to read HTTP data
app.use(express.urlencoded({
	extended: false
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

const MySQLStore = require('express-mysql-session');
var options = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
	clearExpired: true,
	// The maximum age of a valid session; milliseconds:
	expiration: 3600000, // 1 hour = 60x60x1000 milliseconds
	// How frequently expired sessions will be cleared; milliseconds:
	checkExpirationInterval: 1800000 // 30 min
};

// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'edutor_session',
	secret: 'edutor',
	resave: false,
	store: new MySQLStore(options),
	saveUninitialized: false,
}));


const flash = require('connect-flash');
app.use(flash());

// Bring in database connection
const DBConnection = require('./config/DBConnection');
app.use(passport.initialize());
app.use(passport.session())

app.use(function (req, res, next) {
	// res.locals.users = req.session;
	// console.log(res.users)
	res.locals.messages = req.flash('message');
	res.locals.errors = req.flash('error');
	res.locals.success = req.flash("success");
	res.locals.user = req.user || null
	// console.log(req.user.email)
	next()
});

const flashMessenger = require('flash-messenger');
app.use(flashMessenger.middleware);
// Connects to MySQL database
DBConnection.setUpDB(false); // To set up database with new tables

// app.use(function (req, res, next) {
// 	res.locals.messages = req.flash('message');
// 	res.locals.errors = req.flash('error');
// 	next();
// });

// mainRoute is declared to point to routes/main.js
const mainRoute = require('./routes/main');
const authRoute = require('./routes/auth');
const bookingRoute = require('./routes/tutorConsultation');
const dashboardRoute = require('./routes/dashboard');
const eventRoute = require('./routes/tutorEvent');
const studenteventRoute = require('./routes/studentEvent');




app.use('/', mainRoute);
app.use('/auth', authRoute);
app.use('/tutor/consultation', bookingRoute);
app.use('/dashboard', dashboardRoute);
app.use('/tutor/event', eventRoute);
app.use('/student/event', studenteventRoute);




const port = 5000;

// Starts the server and listen to port
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});