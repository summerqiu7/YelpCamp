const express = require ("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


// ================================================================
// All Routes
// ================================================================

// Homepage route
router.get("/", function (req,res){
    res.render("landing");
});


// ==============================================
// Auth Routes
// ==============================================

// Register form page
router.get("/register",function(req,res){
    res.render("register");
});

// Register - handling user sign up logic
router.post("/register", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({username:username});
    User.register(newUser, password, function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
            // facebook/twitter can be replaced with "local"
                passport.authenticate("local")(req, res, function(){
                    req.flash("success","Welcome to YelpCam " + user.username + ", Please Log in!");
                    res.redirect("/login");
            });
    });
});

// Login route
router.get("/login", function(req,res){
    res.render("login");
});

// Login logic
// middleware
router.post("/login", passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function(req,res){
});

// Log out route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});



module.exports = router;
