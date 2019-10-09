const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const seedDB = require("./seeds");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const passport = require("passport");
const flash = require ("connect-flash");
LocalStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");

const commentRoutes      = require("./routes/comment"),
      campgroundRoutes   = require("./routes/campgrounds"),
      authRoutes         = require("./routes/index")

// seed the databse

// seedDB(); 

mongoose.connect('mongodb+srv://summerqiu:summermg@cluster0-5nrxj.mongodb.net/yelp_camp?retryWrites=true&w=majority',{useNewUrlParser:true});
// 'mongodb+srv://devsummer:summermg@cluster0-oa1hv.mongodb.net/yelp_camp?retryWrites=true&w=majority'

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
    next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(3000, function(){
    console.log("Server is On!");
})