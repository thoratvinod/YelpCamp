var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// MiddleWare - Authentication
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in");
    res.redirect("/login");
}

// MiddleWare - Authentication and Authorization
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                res.redirect("back")
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    return next();
                }else{
                    req.flash("error","You do not have permission to access this campground");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","You do not have logged in");
        res.redirect("back");
    }
}

// MiddleWare - Authentication and Authorization
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back")
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    return next();
                }else{
                    req.flash("error","You do not have permission to access this comment");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","You need to be log in")
        res.redirect("back");
    }
}

module.exports = middlewareObj;