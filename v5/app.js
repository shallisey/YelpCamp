var express    = require('express');
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");
var seedDB     = require("./seeds");

seedDB();
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));







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

app.get("/campgrounds/:id/comments/new", function(req, res){
	//find camgoround by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});

		}
	});
});

// app.post('/campgrounds/:id/comments', (req, res) => {
//     Campground.findById(req.params.id, (err, campground) => {
//         if(err){
//             console.log(err)
//         }else{
//             Comment.create(req.body.comment, (err, comment) => {
//                 if(err){
//                     console.log(err)
//                 }else{
//                     campground.comments.push(comment);
//                     campground.save();
//                     res.redirect(`/campgrounds/${campground._id}`)
//                 }
//             })
//         }
//     })
// })

app.post("/campgrounds/:id/comments", function(req, res){
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
	//create new comment
	//connect to campground/
	// redirect to campground
});

app.listen(3000, process.env.IP, function(){
	console.log("Yelp Camp server has started!!");
});