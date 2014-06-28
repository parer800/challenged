// config/passport.js
// keep passport configuration here and take in the created passport object as parameter from the server.js

// load all necessary includes
var LocalStrategy		= require('passport-local').Strategy;
// load the user model

var User 				= require('../model/user');




function setProfileName(user, name){
	user.profile.name = name;
}



// expose this function to our app using module.exports


module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});


	//===========================================
	// LOCAL SIGNUP =============================
	//===========================================

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, email is used in this application so override it!
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allow passong back the entire request to the callback

	},

	function(req, email, password, done) {
		// asynchronous !!!!!
		// User.findOne wont be called unless data is sent back
		process.nextTick(function() {
			// find user whose email corresponds to the one in the form
			// checkoing to see if the user who tries to login already exists
			User.findOne({'local.email' : email}, function(err, user) {
				// if there are errors; return the error
				console.log("User: ");
				if(err){
					return done(err);
				}

				if(user) {
					return done(null, false, null); // {message : 'That email is already taken, please choose another!'}
				}
				else {

					//if email is not taken
					// create the user
					var newUser			= new User();
					

					// set up user's local login info
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					//newUser.local.password = password;
					// save the user
					console.log(newUser);
					newUser.save(function(err) {
						if(err){
							console.log(err);
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));
 

	//=====================================================================================
	//LOCAL LOGIN =========================================================================
	//=====================================================================================

	passport.use('local-login', new LocalStrategy({
		// by default local startegy uses username which we override with email.
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback  : true // allows to pass back entire request to the callback
	},
	function(req, email, password, done) { 
		// callback with email and password from the form.
		// find a user with the same email as in the form
		// check if the user exists
		User.findOne({'local.email' : email}, function(err,user) {
			if(err)
				return done(err);

			// if user doesn't exists
			if(!user)
				return done(null, false /*, futer flash message e.g. req.flash*/);

			// if user exists but wrong password
			if(!user.validPassword(password))
				return done(null, false /*, flash message*/);

			// Login Success
			return done(null, user);
		});
	}));
};
