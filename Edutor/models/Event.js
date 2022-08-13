const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Event = db.define('Event',
    {
        title: { type: Sequelize.STRING },

        eventURL: { type: Sequelize.STRING },

        description: { type: Sequelize.STRING },
        startdate: { type: Sequelize.DATE },
        enddate: { type: Sequelize.DATE },
        starttime: { type: Sequelize.DATE },
        endtime: { type: Sequelize.DATE },
        price: { type: Sequelize.FLOAT },
        userId: { type: Sequelize.STRING }

    });

module.exports = Event;