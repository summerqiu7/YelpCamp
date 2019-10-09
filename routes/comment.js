const express = require ("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require ("../models/comment");
const middleware = require("../middleware/index.js");


// Comment routes
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
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
                    req.flash("success","Comment created successfully!");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// edit comment route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if (err) {
            console.log(err);
            res.redirect("/campground");
        }else{
            res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
        }
            });
});

// Edited comment updated
router.post("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
    const campground_id = req.params.id;
    const content = req.body.content;
    const editedComment = {content:content};
    Comment.findByIdAndUpdate(req.params.comment_id, editedComment, function(err,newComment){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success","Comment updated successfully!");
            res.redirect('/campgrounds/'+ campground_id);
        }
    });
});

// Delete comment route
router.post("/campgrounds/:id/comments/:comment_id/delete",middleware.checkCommentOwnership, function(req,res){
    const campground_id = req.params.id;
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("error","Comment deleted!");
            res.redirect('/campgrounds/'+ campground_id);
        }
    });
});


module.exports = router;