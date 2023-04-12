const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();

// Configure body-parser to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Configure express-session middleware
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

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

// Define routes
app.get("/", function (req, res) {
  res.send("Hello, world!");
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

// Start the server
app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
