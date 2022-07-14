const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

class UserRole {
    static Admin() { return "admin" };
    static Tutor() { return "tutor" };
    static Student() { return "student" };
}

// Create users table in MySQL Database
const User = db.define('user',
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING },
        confirm_password: { type: Sequelize.STRING },
        verified: { type: Sequelize.STRING, allowNull: true, defaultValue: "no" },
        roles: { type: Sequelize.STRING, allowNull: false },
        profile_pic: {
            type: Sequelize.STRING,
            defaultValue: "profile"
        },
        verification_code : {type: Sequelize.UUID,defaultValue: Sequelize.UUIDV4},
    });
module.exports = User;
