require('dotenv').config();

const express = require("express");
const bp = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const passport = require('passport');
const localStrategy = require('passport-local');

const app = express();

//ejs template engine configuration
app.set('view engine', 'ejs');
// app.set("views", "views");

//App config
app.use(express.static("public/"));
app.use(express.json());
app.use(bp.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// DB Models exports
const User = require('./models/User');
const Content = require('./models/Content')

// routes imported
const routes = require('./routes/main');
const userRoutes = require('./routes/userRoutes')

// DB Connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


// Passport config
app.use(flash());
app.locals.moment = require('moment');

app.use(require("express-session")({
  secret: "Yeah I did it",
  resave: false,
  saveUninitialized: false  
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Imported routes use
app.use(routes);
app.use(userRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
