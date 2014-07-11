// /routes/api.js
var User 	   = require('../model/user');
var League 	   = require('../model/league');



module.exports = function(app, isLoggedIn) {
	app.get('/api/users', isLoggedIn, function (req, res) {
		// Async db call
		User.find({}, function (err, users) {
			var userMap = {};	// mapping a users by their id
			var user_data = [];
			users.forEach(function (user) {
				userMap[user._id] = user;
				user_data.push(user.profile);
			});
			if(err)
				throw err;
			console.log(user_data);
			res.json(user_data);
		});
	});




	// =============================================================
	// LEAGUES =====================================================
	// =============================================================

	app.post('/api/createLeague', isLoggedIn, function (req, res) {
		console.log("inside createLeague");
		console.log(req.body);
        var league = new League({name: req.body.name, creator: req.user});
		league.addLeague(res);
	});

	app.get('/api/leagues', isLoggedIn, function (req, res) {
		console.log("leaguessssssssssssssssssssssssssssss");
		//Select leagues created by the user
		League.find({creator: req._passport.session.user})
		.populate({
			path: 'creator',
			select: 'profile _id'
		})
		.exec(function (err, result) {
			if (err) return handleError(err);

			console.log(result);
			res.send(result);	
		});

	});

};


