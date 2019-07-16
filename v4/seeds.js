var mongoose =   require("mongoose");
var Campground = require("./models/campground");
var Comment = 	 require("./models/comment");

var data = [
	{
		name: "Clouds Rest",
		image: "https://images.unsplash.com/photo-1535049883634-993346531df6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Blah blah blah"
	},
	{
		name: "Trees",
		image: "https://images.unsplash.com/photo-1500332988905-1bf2a5733f63?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Blah blah blah"
	},
	{
		name: "Cold place",
		image: "https://images.unsplash.com/photo-1539712879055-47dcc6c91f35?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Blah blah blah"
	}
];

function seedDB(){
	//Remove all Campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds");
		//add a few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err);
				} else {
					console.log("added a campground");
					//add a few comments
					Comment.create(
						{
							text: "This place is great,but I wish their was internet!", 
							author: "Homer"
						}, function(err, comment){
							if(err){
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("created new comment");
							}
						});
				}
			});
		});
	});
}

module.exports = seedDB;

