const express  = require("express");
const router   = express.Router();
const passport = require("passport");
const User     = require("../models/users");


//root route
router.get("/", function(req, res){
	res.render("landing");
});



//show registration form
router.get("/register", (req, res) =>{
	res.render("register");
});

//handle signup logic
router.post("/register", (req, res) => {
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) =>{
		if(err) {
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, ()=> {
			req.flash("success", "Welcome to YelpCamp" + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// show login form
router.get("/login", (req, res)=>{
	res.render("login");
});

// login logic
router.post("/login",passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {

});

//logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/campgrounds");
});

module.exports = router;
