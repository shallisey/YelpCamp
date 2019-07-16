const middlewareObj = {};
const Campground = require("../models/campground");
const Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) =>{
			if(err || !foundCampground){
				req.flash("error", "Campground not found");
				res.redirect("/login");
			} else {
				//does user own the campground
				if(foundCampground.author.id.equals(req.user._id)){
					return next();
				} else{
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}

			}
	});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) =>{
			if(err || !foundComment){
				req.flash("error", "comment not found");
				res.redirect("back");
			} else {
				//does user own the comment
				if(foundComment.author.id.equals(req.user._id)){
					return next();
				} else{
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}

			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function isLoggedIn( req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;