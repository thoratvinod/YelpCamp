var express = require("express");
var router = express.Router({ mergeParams : true });
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middlewareObj = require("../middleware/index");


// NEW -- giving form to write comments
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    var id = req.params.id;
    res.render("comment/new",{id:id});
});

// CREATE -- creating comments
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    var id = req.params.id;
    var newComment = req.body.comment;
    Comment.create(newComment,function(err, comment){
       if(err){
           console.log(err);
           req.flash("error","Some error occurs, Your comment is not added");
           res.redirect("/campgrounds/"+id);
       }else{
           Campground.findById(id,function(err, foundCampground){
               if(err){
                   console.log(err);
                   req.flash("error","Campground is not Found");
                   res.redirect("/campgrounds");
               }else{
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   console.log(comment);
                   foundCampground.comments.push(comment);
                   foundCampground.save(function(err, campground){
                       if(err){
                           console.log(err)
                       }else{
                           console.log("comment added");
                           res.redirect("/campgrounds/"+id);
                       }
                   })
               }
           })
       }
    });
});

// EDIT - Edit the Comments
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        res.render("comment/edit",{ comment : foundComment , id : req.params.id, comment_id : req.params.comment_id});
    })
});

// UPDATE - Update the Comments
router.put("/:comment_id",middlewareObj.checkCommentOwnership, function(req, res){
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        }else{
            console.log("Comment Updated");
            req.flash("success","Comment Successfully Updated")
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

// DELETE - Delete the Comments
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            console.log(err)
        }else{
            console.log("comment successfully Deleted");
            req.flash("success","Comment successfully Deleted")
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
})



module.exports = router;