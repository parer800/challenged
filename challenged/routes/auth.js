// Authentication routing

module.exports = function(app, passport){

	//===================================
	// SIGNUP FORM =======================
	//===================================
	app.get('/signup', function(req,res) {

		res.render('signup', {title: 'Signup', message: 'Login view'});
	});
	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect  : '/home', // redirect and user is authenticated
		failureRedirect : '/signup' // redirect back to signup page
		//failureFlash : true // allow flash message
	}));

	//===================================
	// LOGIN FORM =======================
	//===================================
	app.get('/login', function(req,res) {

		res.render('login',{title: 'Login', message: 'Login view'});
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect secured- logged in user to the home page of the single page application
		failureRedirect : '/login' // rediret user back to login page
		//failureFlash : true // allow flash messages to be shown to user
	}));

	//==================================
	// LOGOUT ==========================
	//==================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.send({"status": "logged out"});
	})

}