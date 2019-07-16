var express    = require('express');
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var seedDB     = require("./seeds");

// seedDB();
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");







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
			res.render("index", {campgrounds: allCampgrounds});
		}	
	});
	
	
});

//NEW ROUTE
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
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
			res.render("show", {campground: foundCampground});
		}
	});
});


app.listen(3000, process.env.IP, function(){
	console.log("Yelp Camp server has started!!");
});