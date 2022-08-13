const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create users table in MySQL Database
const Review = db.define('review',
    {
        title: { type: Sequelize.STRING },
        category: { type: Sequelize.STRING },
        image: { type: Sequelize.STRING },
        rating: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING },
        tutor_id: { type: Sequelize.STRING },
        product_id: { type: Sequelize.STRING },
        product_name: { type: Sequelize.STRING },
        sentiment_score: {type: Sequelize.FLOAT},
        username: { type: Sequelize.STRING }
    });
module.exports = Review, db;
