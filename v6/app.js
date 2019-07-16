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




app.get("/", function(req, res){
	res.render("landing");
});

 // INDEX PAGE
app.get("/campgrounds", function(req, res){
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}	
	});
	
	
});

//NEW ROUTE
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});


//CREATE ROUTE
app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	//create new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
	
	//get data from form and add to campgrounds array
	//rediredct backt to campgrounds page
});

//SHOW ROUTE
app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// =============================================
// COMMENT ROUTES
// =============================================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	//find camgoround by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});

		}
	});
});



app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	//lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});
// =======================
// AUTH ROUTES
//========================

//show registration form
app.get("/register", (req, res) =>{
	res.render("register");
});

//handle signup logic
app.post("/register", (req, res) => {
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) =>{
		if(err) {
		console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, ()=> {
			res.redirect("/campgrounds");
		});
	});
});

// show login form
app.get("/login", (req, res)=>{
	res.render("login");
});

// login logic
app.post("/login",passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {

});

//logout route
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

// MIDDLEWARE
function isLoggedIn( req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


app.listen(3000, process.env.IP, function(){
	console.log("Yelp Camp server has started!!");
});