const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const morgan = require("morgan");
const axios = require('axios');
const ejs = require('ejs');

const app = express();

// Configure body-parser to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Set view to EJS
app.set('view engine', 'ejs');

// Configure express-session middleware
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Add Morgan logging
app.use(morgan("combined"));

// Configure Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport LocalStrategy
passport.use(
  new LocalStrategy(function (username, password, done) {
    // Replace this with your own authentication logic
    if (username === "test" && password === "password") {
      return done(null, { id: 1, username: "test" });
    } else {
      return done(null, false);
    }
  })
);

// Configure Passport serialization and deserialization
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  // Replace this with your own database lookup logic
  if (id === 1) {
    return done(null, { id: 1, username: "test" });
  } else {
    return done(new Error("User not found"));
  }
});

const API_KEY = 'BNQW0ONCQHY90BJO'; // replace with your actual API key from Alpha Vantage


// Define routes
app.get('/sentiment/:symbol', (req, res) => {
  const symbol = req.params.symbol;

  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`;
  axios.get(url)
  .then(response => {
    const data = response.data;
    res.json(data);
  })
  .catch(error => {
    console.error(`Request failed with error ${error.response.status}: ${error.response.statusText}`);
    res.status(error.response.status).send(error.response.statusText);
  });
});  

// Define routes
app.get('/pullstock', (req, res) => {
  const symbol = req.body.stock;

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  axios.get(url)
    .then(response => {
      const data = response.data;
      const quote = data['Global Quote'];
      res.json(stockInfo);
    })
    .catch(error => {
      console.error(`Request failed with error ${error.response.status}: ${error.response.statusText}`);
      res.status(error.response.status).send(error.response.statusText);
    });
});

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get("/login", function (req, res) {
  res.send(`
    <form method="post" action="/login">
      <label>
        Username:
        <input type="text" name="username">
      </label>
      <br>
      <label>
        Password:
        <input type="password" name="password">
      </label>
      <br>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Start the serverreq.params;
app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
