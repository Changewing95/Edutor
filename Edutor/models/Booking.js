const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const moment = require('moment');
const sequelize = require('sequelize');

// Create users table in MySQL Database
const Consultation = db.define('consultations',
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        title: { type: Sequelize.STRING },
        consultationURL: { type: Sequelize.STRING },
        price: { type: Sequelize.FLOAT },
        description: { type: Sequelize.STRING },
        date: { type: Sequelize.DATE },
        start_time: { type: Sequelize.DATE },
        end_time: { type: Sequelize.DATE },
        roomURL: {type: Sequelize.STRING},
    });

module.exports = Consultation;