const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//comments new

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	//find camgoround by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});

		}
	});
});

//comments create

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	//lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong!");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					req.flash("success", "Successfully added comment");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// Edit comment

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) =>{
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err || !foundCampground)	{	
			req.flash("error", "Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, (err, foundComment) =>{
			if(err){
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
	
});

//COMMENT UPDATE

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// Comment Destroy route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
	//find by id and remove
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
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