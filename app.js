require('dotenv').config();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const express = require('express');

//const mongoose = require('./routes/mongodb-connection');
const Product = require('./models/Product');
const LoginData = require('./models/Login');

//const pool = require('./routes/postgresql-connection');
//const Review = require('./models/Review');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(`postgres://postgres:${process.env.POSTGRESQL_PASSWORD}@localhost:5432/postgres`);

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
  secret: process.env.SUPER_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));


app.get('/', async (req, res) => {
   try {
      const item = await fetchRandomItem();
      const review = await fetchRandomReview();
      const user = req.session.user || null;
  
      res.render('index', { title: 'View Item and Review', item: item, review: review, user: user});
   } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: 'An error occurred while fetching data.' });
   }
});
  
app.get('/login', (req, res) => {
   res.render('login');
});

app.get('/logout', (req, res) => {
   // Clear the user's session
   req.session.destroy();
  
   // Redirect to the login page
   res.redirect('/');
});

app.get('/cart', async (req, res) => {
   try {
       const user = req.session.user || null;
       if (!user) {
           return res.redirect('/login');
       }

       // Find the user's cart items
       const userCart = await LoginData.findById(user._id).select('cart');
       const productIds = userCart.cart;

       // Fetch the products from collection
       const products = await Product.find({ _id: { $in: productIds } });

       res.render('cart', { cartItems: products });
   } catch (error) {
       console.error('Error fetching cart items:', error);
       res.status(500).render('error', { message: 'An error occurred while fetching your cart items.' });
   }
});


  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/login', async (req, res) => {
   try {
      const { email } = req.body;
      let user = await findUserByEmail(email);
  
      if (!user) {
        console.log("No User Found");
      }
  
      // Set the user in the session or a cookie
      req.session.user = user;
  
      res.redirect('/');
   } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'An error occurred during login.' });
   }
});

app.post('/add-to-cart', async (req, res) => {
   try {
       const { productId } = req.body;
       const user = req.session.user;

       // Find the user and update their cart
       await LoginData.findByIdAndUpdate(user._id, { $addToSet: { cart: productId } });

       res.redirect('/');
   } catch (error) {
       console.error('Error adding product to cart:', error);
       res.status(500).json({ message: 'An error occurred while adding the product to the cart.' });
   }
});

app.post('/remove-from-cart', async (req, res) => {
   try {
       const { productId } = req.body;
       const user = req.session.user;

       await LoginData.findByIdAndUpdate(user._id, { $pull: { cart: productId } });

       res.redirect('/');
   } catch (error) {
       console.error('Error removing product from cart:', error);
       res.status(500).json({ message: 'An error occurred while removing the product from the cart.' });
   }
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// other functions
async function fetchRandomItem() {
   try {
      const result = await Product.aggregate([{ $sample: { size: 1 }}])
      return result[0];
   } catch (err) {
      console.error('Error fetching random item from MongoDB:', err);
      throw err;
   }
}

async function fetchRandomReview() {
   try {
      const result = await sequelize.query(
        `SELECT reviewerID, asin, reviewerName, reviewText FROM amazon_reviews AS Review ORDER BY RANDOM() LIMIT 1;`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      return result[0];
   } catch (error) {
      console.error('Error fetching random review from PostgreSQL:', error);
   }
}

async function findUserByEmail(email) {
   try {
      const result = await LoginData.aggregate([
         { $match: { email: email } }
      ]);
      return result[0];
   } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
   }
}

module.exports = app;
