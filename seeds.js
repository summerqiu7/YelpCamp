const mongoose = require ("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name:"summer", 
        image:"https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60", 
        description:"camping on top of mountain"},
    {
        name:"fall", 
        image:"https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60", 
        description:"green leafed tree during night time when camping"},
    {
        name:"spring", 
        image:"https://images.unsplash.com/photo-1568576550491-185584b2145a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60", 
        description:"sign in forest"}
]

function seedDB(){
    // remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
            console.log("removed campgrounds");
            // create campgrounds
            data.forEach(function(seed){
                Campground.create(seed,function(err,campground){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("added a new campground");
                        // create comments
                        Comment.create(
                            {
                            content:"This place is awesome!",
                            author:"elvis"
                        }, function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created a new comment");
                            }
                        });
                    }
                });
            });
    });
};

module.exports = seedDB;