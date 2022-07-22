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
var http = require('http').Server(app);
var io = require('socket.io')(http)
const { spawn } = require("child_process");




// io.on("connection",function(socket){
// 	console.log("The number of connected sockets: "+socket.adapter.sids.size);
// 	io.sockets.emit('studentCount', {studentCount: socket.adapter.sids.size})
// });


// var studentCount = 0
// io.sockets.on('connection', function (socket) {
// 	studentCount++
// 	io.sockets.emit('studentCount', {studentCount: studentCount});
	
// 	socket.on('disconnect', function () {
// 		studentCount--
// 		io.sockets.emit('studentCount', {studentCount: studentCount});
// 		console.log('disconnect');
// 	})
// })

// const chartArray = [];

// io.on('connection', (socket) => {
//     socket.on('add', (data) => {
//         chartArray.push(data);
//     }); 

//     setInterval(function() {
//         socket.emit('update', chartArray);}, 30000);
// });


// app.engine('handlebars', engine({
// 	handlebars: allowInsecurePrototypeAccess(Handlebars),
// 	defaultLayout: 'main' // Specify default template views/layout/main.handlebar
// }));
const helpers = require('./helpers/handlebars');
app.engine('hbs', engine({
	helpers: {
		helpers,
		if_equal: helpers.isEqualHelperHandlerbar,
		replaceCommas: helpers.replaceCommas,
		formatDate: helpers.formatDate,
		if_eq: helpers.if_eq
	},
	defaultLayout: 'main',
	extname: '.hbs',
	handlebars: allowInsecurePrototypeAccess(Handlebars),

}));
app.set('view engine', 'hbs');


// REDIS DATABASE FOR RECOMMENDATION

// const ls = spawn("Redis\\redis-server.exe", ["Redis\\redis.windows.conf"]);

// ls.stdout.on("data", data => {
// 	console.log(`stdout: ${data}`);
// });

// ls.stderr.on("data", data => {
// 	console.log(`stderr: ${data}`);
// });

// ls.on('error', (error) => {
// 	console.log(`error: ${error.message}`);
// });

// ls.on("close", code => {
// 	console.log(`child process exited with code ${code}`);
// });


// 



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
const tutorialRoute = require('./routes/tutorTutorial');
const cartRoute = require('./routes/cart');
const studbookingRoute = require('./routes/studentConsultation');
const adminRoute = require('./routes/admin');



app.use('/', mainRoute);
app.use('/auth', authRoute);
app.use('/tutor/consultation', bookingRoute);
app.use('/dashboard', dashboardRoute);
app.use('/tutor/tutorial', tutorialRoute);
app.use('/cart', cartRoute);
app.use('/student/consultation', studbookingRoute);
app.use('/admin', adminRoute);




const port = 5000;

// Starts the server and listen to port
// app.listen(port, () => {
// 	console.log(`Server started on port ${port}`);
// });


http.listen(port, () => console.log(`Listening on port ${port}`));
