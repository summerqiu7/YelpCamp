const express = require ("express");
const router = express.Router();
const Campground = require("../models/campground");


// Index - display the list of the campgrounds
router.get("/campgrounds", function (req,res){ 
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
        }
    })
    }); 
    
// New - add new campground to the list of the campgrounds
router.post("/campgrounds", isLoggedIn, function(req,res){
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {name:name, image: image, description:description, author:author};
    // create a new campground and save to db
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{

            res.redirect("/campgrounds");
        }
    });
});

// NewForm - show form to create new campground
router.get("/campgrounds/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

// Show/Info - show more info
router.get("/campgrounds/:id", isLoggedIn, function(req,res){
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


    function isLoggedIn(req,res,next){
        if (req.isAuthenticated()){
            return next();
        } 
        res.redirect("/login");
    };
    module.exports = router;