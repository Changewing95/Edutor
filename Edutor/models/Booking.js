const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');
const sequelize = require('sequelize');

// Create users table in MySQL Database
const Consultation = db.define('consultations',
    {
        title: { type: Sequelize.STRING },
        consultationURL: { type: Sequelize.STRING },
        price: { type: Sequelize.FLOAT },
        description: { type: Sequelize.STRING },
        date: { type: Sequelize.DATE },
        start_time: { type: Sequelize.STRING },
        end_time: { type: Sequelize.STRING },
    });

module.exports = Consultation;