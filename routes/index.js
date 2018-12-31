var express = require("express")
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/",function(req, res){
    res.render("campground/home");
});

// signup route
router.get("/register",function(req, res){
  res.render("register");
});

router.post("/register",function(req, res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error","Username is already exists, please choose another");
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Registered Successfully !!!");
            res.redirect("/campgrounds");
        });
    });
});

// login route

router.get("/login",function(req, res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),function(req, res){
});

// logout Routes

router.get("/logout",function(req, res){
    req.logout();
    req.flash("success","You Logged out")
    res.redirect("/campgrounds");
});

module.exports = router;