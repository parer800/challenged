/*
 * GET home page.
 */
module.exports = function(app,passport){


	app.get('/', function(req,res) {
		console.log(req.isAuthenticated());
		if(req.isAuthenticated())
			res.redirect('/home');
		else
			res.render('login');

	});

	app.get('/home', isLoggedIn, function(req,res) {
		console.log(req.user.local.email);
		res.render('index.hjs', {"user": req.user.local.email});
	});


	// Authentication route ===========================
	require('./auth')(app, passport);


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