var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Salmon Creek", image: "https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg"},
		{name: "Granite Hill", image: "https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg"},
		{name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"}
];


app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	//show all campgrounds
	
	res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
	//get data from form and add to campgrounds array
	//rediredct backt to campgrounds page
});


app.listen(3000, process.env.IP, function(){
	console.log("Yelp Camp server has started!!");
});