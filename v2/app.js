var express    = require('express');
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");

// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campgrounds", campgroundSchema);

// Campground.create(
// 	{
// 	name: "Granite Hill", 
// 	image: "https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg",
// 	description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
		
// 	}, function(err, campgrounds){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			console.log("NEWLY CREATED CAMPGROUND");
// 			console.log(campgrounds);
// 		}
// });




app.get("/", function(req, res){
	res.render("landing");
});

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

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

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


app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("show", {campground: foundCampground});
		}
	});
});



app.listen(3000, process.env.IP, function(){
	console.log("Yelp Camp server has started!!");
});