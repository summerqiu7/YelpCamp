const express = require ("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require ("../models/comment");
const User = require("../models/user");

// Comment routes
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
};

module.exports = router;