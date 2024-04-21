const mongoose = require('../routes/mongodb-connection');
const { Schema } = mongoose;

const loginDataSchema = new Schema({
 name: String,
 email: String,
 cart: Array //may need to be changed
});

const LoginData = mongoose.model('Login_data', loginDataSchema, 'Login_data');

module.exports = LoginData;
