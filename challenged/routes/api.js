// /routes/api.js
var User 	   = require('../model/user');
var League 	   = require('../model/league');
var Exercise   = require('../model/exercise');


var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(app, isLoggedIn) {
	
	// =============================================================
	// USER/USERS ==================================================
	// =============================================================	


	app.get('/api/user', isLoggedIn, function (req, res) {

		var map = {};
		map._id = req.user._id;
		map.profile = req.user.profile;
		res.send(map);
	});

	app.get('/api/users', isLoggedIn, function (req, res) {
		// Async db call
		User.find({}, function (err, users) {
			var userMap = {};	// mapping a users by their id
			var user_data = [];
			users.forEach(function (user) {
				userMap[user._id] = user;
				user_data.push({profile: user.profile, _id: user._id});
			});
			if(err)
				throw err;
			res.json(user_data);
		});
	});

	app.get('/api/user/incoming', isLoggedIn, function (req, res) {
		res.send(req.user.incoming);
	});

	app.post('/api/user/incoming', isLoggedIn, function (req, res) {
		
		var arrayIndex = req.body.index;
		var key = "incoming."+arrayIndex;
		console.log(key);
		

		User.findOne({_id:req.user._id}, function (err, user) {
			if(err) throw err;

			var  element = user.incoming.splice(arrayIndex,1)[0];
			user.save(function (err) {
				if (err) throw err;

				League.findOne({_id:element.league.id}, function (err, league) {
					if (err) throw err;

					league.addLeagueReferenceToUser(user, function () {
						res.send({statusMessage:"Invetation has been accepted"});
					});
				});
				
			});
		})

	})



	// =============================================================
	// LEAGUES =====================================================
	// =============================================================

	app.post('/api/createLeague', isLoggedIn, function (req, res) {

        var league = new League({name: req.body.name, duration: req.body.timeSpan});
        var exerciseSchemaList = [];
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(req.body);
        league.creator.push({profile: req.user.profile, _id: ObjectId(req.user._id)});
        //If multiple schemas should be assigned upon creation this must be done in a loop
        req.body.exerciseSchema.forEach(function (schema) {
        		console.log(schema);
        		league.exerciseSchema.push({content:schema.content, name:schema.name, creator: ObjectId(schema.creator)});
        });
        //result message
		var status_message;

        league.save(function(err, result) {
			if (err){
				console.log(err);
				status_message = "Some error occurred while trying to save";
				res.status(400).send(status_message);
			}
			else{
				console.log("success: " + JSON.stringify(this));
				//add league reference to user
				league.addLeagueReferenceToUser(req.user._id, function (message) {
					status_message = "League " + league.name + " was succesfully created";
					res.send({object : result, "statusMessage":status_message});
				});
			}
		});		
	});

	app.get('/api/user/leagues', isLoggedIn, function (req, res) {
		//Select leagues created by the user
		User.findOne({_id: req.user._id})
		.select("league")
		.populate('league')
		.exec(function (err, result) {
			if (err) throw err;

			console.log("!!!!!!!!!!!!!!!!!!! USER LEAGUES !!!!!!!!!!!!!!!!!!!!!");
			console.log(result);
			/*User.findOne({_id:result.creator.creator_id}, function (err, user) {
				
				console.log("##############################################################################");
				console.log(result);
				result.league.creator = user.profile;
				res.send(result.league);
			});*/
			res.send(result.league);

		});

	});



	app.get('/api/leagues', isLoggedIn, function (req, res) {
		//Select leagues created by the user
		League.find({"creator._id": req._passport.session.user})
		.populate({
			path: 'creator._id',
			select: 'profile _id'
		})
		.exec(function (err, result) {
			if (err) throw(err);
			res.send(result);	
		});

	});


	app.get('/api/league/:id', isLoggedIn, function (req, res) {
		console.log("GET LEAGUE INFO!!!!!!!!!!");
		console.log(req.params.id);

		League.findOne({_id: req.params.id})
		.populate({
			path: 'creator',
			select: 'profile _id'
		})
		.exec(function (err, result) {
			if (err) {
				console.log(err);
				throw err;
			}

			console.log(result);
			res.json(result);
			
		});


		/*
		League.findOne({_id : req.params.id}, function (err, league) {
			if(err)
				throw err;

			res.json(league);
		});
*/
	});


	app.post('/api/league/confirmed', isLoggedIn, function (req, res) {
		console.log("confirm task!!!");

		//result message
		var status_message;
		
		League.findOne({_id: req.body.league._id}, function (err, league) {
			if(err){
				console.log(err);
				status_message = "Error while trying to confirm: " + req.body.task.name;
				res.send({"timeline": league.timeline, "statusMessage": status_message});
				throw err;
			}
			league.confirmedEvent(req, function () {
				console.log("callback");
				status_message = req.body.task.name + " has been confirmed"
				res.send({"timeline": league.timeline, "statusMessage": status_message});
			});

		});
	});

	app.get('/api/league/timeline/:league_id', isLoggedIn, function (req, res) {
		console.log("timeline");
		console.log(req.query)
		var league_id = req.params.league_id;

		League.findOne({_id: league_id}, function (err, league) {
			if(err) {
				console.log(err);
				throw err;
			}
			else{

				res.json({'timeline': league.timeline});
			}
		});
	});

	app.get('/api/league/confirmedevents/:league_id/:league_week', isLoggedIn, function (req, res) {
		var league_id = req.params.league_id;
		var league_week = +req.params.league_week;
		var user = req.user;
/*
		User.find({_id: req.user._id}, {"timeline":{$elemMatch:{league_id: league_id}}}, function (err, events) {
			console.log(events);
			res.send(events);
		});*/

		var query = User.find({_id: req.user._id});
		query.where('timeline.league_id').equals(league_id);
		query.select("timeline");
		var map = {};
		var ids = [];
		map.events = [];
		query.exec(function (err, documents) {
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!###############!!!!!!!!!!!!!!!!!!");
			console.log(documents);
			if(documents.length > 0){
				documents[0].timeline.forEach(function (item) {
					if(item.league_id == league_id){
						var key = item.events[0].league_week;
						if(key == league_week){
							ids.push(item.events[0].event._id);
							map.events.push(item.events[0].event);
						}
					}
					
				});
			}
			res.send(ids);
		})
		/*User.find({_id: req.user._id}, {"timeline.league_id":league_id, "timeline":{$elemMatch:{league_id: league_id}}}, function (err, events) {
			console.log(events);
			res.send(events);
		})*/

	});

	app.post('/api/league/contender', isLoggedIn, function (req, res) {
		//Invite another user to the league
		console.log(req.body);

		//result message
		var status_message;
		
		League.findOne({_id: req.body.league._id}, function (err, league) {
			if(err){
				console.log(err);
				status_message = "Error while trying to add user: ";
				res.send({"timeline": league.timeline, "statusMessage": status_message});
				throw err;
			}
			var invitaion_component = {from:req.user.profile.name, to: req.body.contender._id, league:{id:league._id, name:league.name}, date:new Date().getTime(), type:"league"};
			league.invitations.push(invitaion_component.to);
	        league.save(function(err, result) {
				if (err){
					status_message = "couldn't add contender";
					res.status(400).send({"statusMessage":status_message});
				}
				else{
					console.log("success: " + JSON.stringify(this));


					//add league reference to user
					league.addLeagueInvetationToUser(invitaion_component, function (message) {
						res.send({object : result, "statusMessage":message});
					});					

				}
			});	

		});
	});


// =============================================================
// EXERCISE SCHEMA =============================================
// =============================================================
	app.get('/api/exerciseSchemas', isLoggedIn, function (req, res) {
		console.log("INSIDE EXERCISE SCHEMAS");
		User.findOne({_id: req._passport.session.user})
		.select('_id profile ExerciseSchema')
		.populate('ExerciseSchema')
		.exec(function (err, result) {
			if (err) return handleError(err);
			res.send(result);
			
		});

	})

	app.post('/api/createSchema', isLoggedIn, function (req, res) {
		//console.log(req.body);
		
		//var exercise = new Exercise;

		if(typeof req.body.content == 'undefined'){
			res.status(400).send("No exercises were assigned while trying to save, please try again!"); // This is shown on client
			return;
		}


		var exercise = null;
		if(typeof req.body.schemaId == 'undefined'){
			console.log("NEW CREATED SCHEMA CONNECTION");
			exercise = new Exercise({name: req.body.name, creator: req.user});
			req.body.content.forEach(function (item) {
				exercise.content.push({name: item.name, type: item.type, subtype: item.subtype, amount: item.amount});
			});

			exercise.save(function(err, result) {
				if (err) 
					res.send({'error':'An error has occurred'});
				else{
					exercise.addConnectionToUser(exercise._id, req, function() {
						console.log("updated");
						User.findByIdAndUpdate(req.user._id, 
							{$push: {ExerciseSchema : exercise._id}},
							function(err, obj){
								if(err)
									console.log(err);
								if(!obj)
									console.log("cannot save");
								

								//result message
								var status_message = 'Exercise schema "' + req.body.name + '" was successfully saved!'; 
								res.send({object : result, statusMessage: status_message});
							}					  
	     				);
					});
				}
			});	
		}
		else{
			console.log("UPDATING EXERCISE SCHEMA WITH ID: " + req.body.schemaId);
			Exercise.findOne({_id: req.body.schemaId}, function (err, exercise_) {
				if(err){
					status_message = "An error occured with exercise schema";
					console.log(err);
					throw err;
				}
				exercise = exercise_;
				for(var i = exercise_.content.length; i < req.body.content.length; i++){
					var item = req.body.content[i];
					exercise.content.push({name: item.name, type: item.type, subtype: item.subtype, amount: item.amount});
				}

				exercise.save(function(err, result) {
					if (err) 
						res.send({'error':'An error has occurred'});
					else{
						res.send({object : result});
					}
				});

			});
		}

	});



}; // end of module.exports