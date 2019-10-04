const express = require ("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require ("../models/comment");


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
    // const author = req.body.author;
    const content = req.body.content;
    const newlyComment= {content:content};
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(newlyComment, function(err,newComment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    // save comment
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