const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const Tutorial = require('../models/Tutorial');
const Consultation = require('../models/Booking');
const Review = require('../models/Review');
const Order = require('../models/Order');
const OrderItems = require('../models/OrderItems');
// const Video = require('../models/Video');
// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
            /*
            Defines the relationship where a user has many videos.
            The primary key from user will be a foreign key in video.
            */
            User.hasMany(Tutorial);
            Tutorial.belongsTo(User);

            User.hasMany(Consultation);
            Consultation.belongsTo(User);

            User.hasMany(Review);
            Review.belongsTo(User);
            User.hasMany(Order);
            Order.belongsTo(User);

            // Order.hasMany(OrderItems);
            // OrderItems.belongsTo(Order);


            // The sync functioin creates the tables if none exists. The true or false "force" parameter will determine if all tables are preserved or dropped.
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};
module.exports = { setUpDB };