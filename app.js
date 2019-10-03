const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const seedDB = require("./seeds");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const passport = require("passport");
LocalStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");

seedDB();
mongoose.connect('mongodb+srv://summerqiu:summermg@cluster0-5nrxj.mongodb.net/yelp_camp?retryWrites=true&w=majority',{useNewUrlParser:true});
// 'mongodb+srv://devsummer:summermg@cluster0-oa1hv.mongodb.net/yelp_camp?retryWrites=true&w=majority'

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

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

// ================================================================
// All Routes
// ================================================================

app.get("/", function (req,res){
        res.render("landing");
});

// Auth Routes

app.get("/register",function(req,res){
    res.render("register");
});

// handling user sign up
app.post("/register", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.register(new User({username: username}), password, function(err,user){
        if(err){
            console.log(err);
            return res.render("/register");
        } else {
            // facebook/twitter can be replaced with "local"
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

// login route
app.get("/login", function(req,res){
    res.render("login");
});

// login logic
// middleware
app.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function(req,res){
});

// log out route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
};

// index - display the list of the campgrounds
app.get("/campgrounds", isLoggedIn, function (req,res){  
Campground.find({},function(err,allCampgrounds){
    if(err){
        console.log(err);
    }else{
        res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
})
}); 

// New - add new campground to the list of the campgrounds
app.post("/campgrounds", isLoggedIn, function(req,res){
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCampground = {name:name, image: image, description:description};
    // create a new campground and save to db
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

// New - show form to create new campground
app.get("/campgrounds/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

// Show - show more info
app.get("/campgrounds/:id", isLoggedIn, function(req,res){
    // find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/info",{campground:foundCampground});
        }
    });
    // render show template with that campground
});


// comment routes
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
    const author = req.body.author;
    const content = req.body.content;
    const newComment= {author:author, content:content};
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(newComment, function(err,newComment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(newComment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
})

app.listen(3000, function(){
    console.log("Server is On!");
})