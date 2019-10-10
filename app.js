const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const seedDB = require("./seeds");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const passport = require("passport");
const flash = require ("connect-flash");
const dotenv = require('dotenv');

dotenv.config();

LocalStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");

const commentRoutes      = require("./routes/comment"),
      campgroundRoutes   = require("./routes/campgrounds"),
      authRoutes         = require("./routes/index")

// seed the databse

// seedDB(); 
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const dbUrl = 'mongodb+srv://' + DB_USERNAME + ':' +  DB_PASSWORD + '@cluster0-5nrxj.mongodb.net/yelp_camp?retryWrites=true&w=majority';
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex: true
});

// command line
//  mongo "mongodb+srv://cluster0-5nrxj.mongodb.net/admin"  --username summerqiu

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(flash());

// passport configuration
app.use(require("express-session")({
    secret:"summer is the best",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

const port_number = app.listen(process.env.PORT || 3000);
app.listen(port_number);