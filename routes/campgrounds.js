var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware/index");

// INDEX - Show the All Campgrounds in Database
router.get("/",function(req,res){

    Campground.find({},function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campground/index",{campgrounds:campgrounds});
        }
    });
});


// NEW - Gives Form for creating new Campground
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {

    res.render("campground/new");
});

// CREATE - Add the Campground in  the database
router.post("/", middlewareObj.isLoggedIn,function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image= req.body.image;
    var desc = req.body.desc;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    Campground.create({

        name:name,
        price:price,
        image:image,
        description:desc,
        author : author

    },function(err, campground){
            if(err){
                console.log(err);
                req.flash("error","Unable to create campground")
                res.redirect("/campgrounds");
            }else{
                console.log("New Campground is added.");
                console.log(campground);
                res.redirect("/campgrounds")
            }
    });

});

// SHOW - Shows the more information  of campground
router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err);
            req.flash("error","Unable to find this page")
            res.redirect("/campgrounds");

        }else{
            res.render("campground/show",{campground:campground});
        }
    });
});

// EDIT - Edit the Campground
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            req.flash("error", "Some error occurs");
            res.redirect("/campgrounds/"+req.params.id);

        }else{
            res.render("campground/edit",{ campground : foundCampground });
        }
    })
});

// UPDATE - Update the Campground
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            console.log(err);
            req.flash("error","Unable to update Campground Details");
            res.redirect("/campgrounds/"+ campground._id);
        }else{
            console.log("Campground Updated");
            req.flash("success","Campground Successfully Updated");
            res.redirect("/campgrounds/"+ campground._id);
        }
    });
});

// DELETE - Delete the Campground
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash("error","Unable to Delete Campground Details");
            res.redirect("/campgrounds");
        }else{
            console.log("successfully Deleted");
            req.flash("success","Campground Successfully Deleted");
            res.redirect("/campgrounds");
        }
    });
})


module.exports = router;