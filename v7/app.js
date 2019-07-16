const express       = require('express');
const app           = express();
const bodyParser    = require("body-parser");
const mongoose      = require("mongoose");
const Campground    = require("./models/campground");
const Comment       = require("./models/comment");
const seedDB        = require("./seeds");
const passport   	= require("passport");
const LocalStrategy = require("passport-local");
const User          = require("./models/users");

// requiring routes
const campgroundsRoutes = require("./routes/campgrounds"),
	  commentRoutes     = require("./routes/comments"),
	  indexRoutes       = require("./routes/index");

seedDB();
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Okapi is the best",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentRoutes);




app.listen(3000, process.env.IP, function(){
	console.log("Yelp Camp server has started!!");
});