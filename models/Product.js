const mongoose = require('../routes/mongodb-connection');
const { Schema } = mongoose;

const productSchema = new Schema({
    _id: String,
    title: String,
    selling_price: String,
    seller: String,
});


const Product = mongoose.model('Eccomerce_Product_dataset', productSchema, 'Eccomerce_Product_dataset');

module.exports = Product;