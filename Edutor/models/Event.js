const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Event = db.define('Event',
    {
        title: { type: Sequelize.STRING },
        //image: { type: Sequelize.STRING},
        eventURL: { type: Sequelize.STRING },

        description: { type: Sequelize.STRING },
        startdate: { type: Sequelize.DATE },
        enddate: { type: Sequelize.DATE },
        starttime: { type: Sequelize.STRING },
        endtime: { type: Sequelize.STRING },
        people: { type: Sequelize.STRING },
        status: { type: Sequelize.STRING },
        price: { type: Sequelize.STRING },

    });

module.exports = Event;