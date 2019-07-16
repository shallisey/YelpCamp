const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//comments new

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	//find camgoround by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});

		}
	});
});

//comments new

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

// MIDDLEWARE
function isLoggedIn( req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;