const { DataTypes } = require('sequelize');
const sequelize = require('./sequelized.js');
const Review = sequelize.define('Review', {
    reviewerID: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
    },
    asin: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
    },
    reviewerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reviewText: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
 tableName: 'amazon_reviews', // This is the name of the table
 timestamps: false 
});

module.exports = Review;

