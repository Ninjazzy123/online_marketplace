require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_CONNECTION;

mongoose.connect(uri, {})
 .then(() => console.log('Connected to MongoDB'))
 .catch(err => console.error('Error connecting to MongoDB', err));

module.exports = mongoose;