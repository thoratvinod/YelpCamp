var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")
var seedDB = require("./seeds");
var User = require("./models/user");
var passport = require("passport");
var localStratergy = require("passport-local");
var indexRoutes = require("./routes/index");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var flash = require("connect-flash");

// mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });

mongoose.connect("mongodb://thoratvinod111:Vinodthorat4571@@ds145704.mlab.com:45704/yelp_camp");

// ==================================== App Configuration =========================================================

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
seedDB();


// ==============================  Passport Configuration  ===================================================


app.use(require("express-session")({
    secret : "My Name is Mauli",
    resave : false,
    saveUninitialized : false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen(process.env.PORT, process.env.IP,function(){
    console.log("YelpCamp Server has Started!");
});
