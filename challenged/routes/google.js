// /routes/google.js
// authentication for google

module.exports = function(app, passport, isLoggedIn){
	
	//===================================================================================
	// CREATE ACCOUNT, AUTHENTICATION ===================================================
	//===================================================================================
	
	// let google do the authentication
	// profile let us get the basic info, this includes their name
	// email let us get their email
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	
	// the callback after google authenticates the user
	app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/home',
				failureRedirect : '/'
		}));



	//===================================================================================
	// CONNECT EXISTING ACCOUNT, AUTHORIZING ============================================
	//===================================================================================

	app.get('/connect/google', isLoggedIn, passport.authorize('google', {scope: ['profile', 'email']}));

	app.get('connect/google/callback',
		passport.authorize('google', {
			successRedirect : '/home',
			failureRedirect : '/'
		}));



};