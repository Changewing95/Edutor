const mySQLDB = require('./DBConfig');
const User = require('../models/User');
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
            // The sync functioin creates the tables if none exists. The true or false "force" parameter will determine if all tables are preserved or dropped.
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};
module.exports = { setUpDB };