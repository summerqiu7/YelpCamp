const Campground = require("../models/campground.js");
const Comment = require("../models/comment.js");
const middlewareObjects = {};

middlewareObjects.isLoggedIn = function (req,res,next){
        if (req.isAuthenticated()){
            return next();
        } 
        res.redirect("/login");
    };

middlewareObjects.checkCampgroundOwnership = function (req,res,next){
        if (req.isAuthenticated()){
            Campground.findById(req.params.id, function(err,foundCampground){
                if (err) {
                    res.redirect ("back");
                } else {
                    if (foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    };
    
middlewareObjects.checkCommentOwnership = function (req,res,next){
        if (req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err,foundComment){
                if (err) {
                    res.redirect ("back");
                } else {
                    if (foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    };

module.exports = middlewareObjects