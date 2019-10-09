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
            console.log(err);
            res.render("register");
        } else {
            // facebook/twitter can be replaced with "local"
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/login");
            });
        }
    });
});

// Login route
router.get("/login", function(req,res){
    res.render("login",{message:req.flash("error")});
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
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
};

module.exports = router;
