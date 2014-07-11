/*
 * GET home page.
 */

var User 	   = require('../model/user');
module.exports = function(app,passport){


	app.get('/', function(req,res) {
		console.log(req.isAuthenticated());
		if(req.isAuthenticated())
			res.redirect('/home');
		else
			res.render('index');

	});

	app.get('/home', isLoggedIn, function(req,res) {
		console.log(req.user.local.email);
		res.render('SPA-index.hjs', {"user": req.user.profile.name});
	});


	// Authentication route ===========================
	require('./auth')(app, passport);

	// Authentication GOOGLE ==========================
	require('./google')(app, passport, isLoggedIn);

	// Authentication GOOGLE ==========================
	require('./google')(app, passport, isLoggedIn);

	// API
	require('./api')(app,isLoggedIn);

};

// Middleware to make sure the user is logged in
function isLoggedIn(req,res,next){
	console.log("Check user is logged in!!!!!");
	console.log(req.isAuthenticated());
	//if user is authenticated in the session; continue
	if(req.isAuthenticated()){
		return next();
	}

	//if not, redirect to home page
	res.redirect('/');
}