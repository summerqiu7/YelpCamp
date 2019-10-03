const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");

seedDB();

mongoose.connect('mongodb+srv://devsummer:summermg@cluster0-oa1hv.mongodb.net/yelp_camp?retryWrites=true&w=majority',{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

// Campground.create({
//     name:"summercamp",
//     image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpzxi2T0cy_GX_b8OLc9dc9DD3-Y5AAKaccn3mZfLYNdnll_hTbQ",
//     description:"This is a beautifull granite"
// }, function(err,newlyCreated){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("newly created a campground!");
//         console.log(newlyCreated);
//     }
// });

app.get("/", function (req,res){
        res.render("landing");
});

// index - display the list of the campgrounds
app.get("/campgrounds", function (req,res){  
Campground.find({},function(err,allCampgrounds){
    if(err){
        console.log(err);
    }else{
        res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
})
}); 

// New - add new campground to the list of the campgrounds
app.post("/campgrounds", function(req,res){
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
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
})

// Show - show more info
app.get("/campgrounds/:id", function(req,res){
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
app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req,res){
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
                    console.log(newComment);
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