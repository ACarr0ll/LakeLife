const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const { ensureAuthenticated } = require('./auth');

const app = express();
const User = require('./model');
const db = require('./db');

app.use(express.json());
app.use(session({
  secret: 'kYp3s6v9y$B&E)H@McQfTjWnZq4t7w!z', // Replace with a long, randomly-generated string
  resave: false,
  saveUninitialized: false
}));

// set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('This route is protected');
});

app.get('/login', (req, res) => {
  res.send('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/', (req, res) => {
  res.send('Welcome to the homepage');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});