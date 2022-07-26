const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Tutorial = db.define('tutorial',
    {
        title: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING(2000) },
        author: { type: Sequelize.STRING },
        // date: { type: Sequelize.DATE },
        category: { type: Sequelize.STRING },
        price: { type: Sequelize.STRING },
<<<<<<< HEAD
=======
        image: { type: Sequelize.STRING },
>>>>>>> 3fae673e13a527d88a5bd4962e7c1121696fd004
        tutorialImageURL: { type: Sequelize.STRING },
        video: { type: Sequelize.STRING },

    });

module.exports = Tutorial;