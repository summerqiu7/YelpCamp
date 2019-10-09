const express = require ("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require ("../middleware/index.js");


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
router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
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
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

// Show/Info - show more info
router.get("/campgrounds/:id", function(req,res){
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


// Edit form page

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground:foundCampground});
        }
    });
   
});

// Update route

router.post("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    const name = req.body.editedName;
    const image = req.body.editedImage;
    const description = req.body.editedDescription;
    const updatedData = {
        name:name,
        image: image,
        description: description
    };
    Campground.findByIdAndUpdate(req.params.id, updatedData,function(err,editedCampground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success","Campground updated!");
            res.redirect('/campgrounds/' + editedCampground._id);
        }
    });
});

// Delete route
 router.post("/campgrounds/:id/delete",middleware.checkCampgroundOwnership, function(req,res){
        Campground.findByIdAndRemove(req.params.id,function(err){
            if (err){
                res.redirect("/campgrounds");
            } else {
                req.flash("error","Campground deleted!");
                res.redirect("/campgrounds");
            }
        });
 });

    module.exports = router;