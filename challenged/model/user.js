//user.js

//Load necessary stuff
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Exercise = require('./exercise');
var League   = require('./league');

var ObjectId = require('mongoose').Types.ObjectId;


var eventComponent = new mongoose.Schema({ date: 'Date',
											  user: 'String',
											  task: 'Mixed',
											  details: 'Mixed'
											}, {
												  _id: false
											});


var TimelineComponent = new mongoose.Schema({
									league_week : {type: "Number", index: true},
									date: "Date",
									event : 'Mixed'
								},
								{
								  	_id: false
								});

var Timeline = new mongoose.Schema({
	league_id	:	 {
		type	: mongoose.Schema.Types.ObjectId,
		ref		: 'League',
		index	: true
	},
	events			: [TimelineComponent]
})


// define user model schema
var userSchema = mongoose.Schema({

	local			: {
		email		: String,
		password	: String,
	},
	google			: {
		id			: String,
		token		: String,
		email		: String,
		name 		: String
	},
	profile			: {
		name 		: String,
		email		: String
	},
	ExerciseSchema	: [{
		type	: mongoose.Schema.Types.ObjectId,
		ref		: 'Exercise'
	}],
	timeline 		: [Timeline],
	league 			: [{
		type	: mongoose.Schema.Types.ObjectId,
		ref		: 'League'
	}]	
});


// METHODS kopplad på objektet ================================

// generate hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function(passowrd) {
	return bcrypt.compareSync(passowrd, this.local.password);
};



userSchema.methods.addLeagueTimelineEvent = function(league, inputdata, callback) {
	var timeline = {};
	timeline.events = [];
	var events = {};
	console.log("inputdata");
	timeline.league_id = ObjectId(inputdata.league._id);
	console.log(timeline.league_id);
	events.league_week = inputdata.league_week;
	events.date = inputdata.date;
	events.event = inputdata.task;
	timeline.events.push(events);

	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log(timeline);
	this.timeline.push(timeline);
	console.log("addLeagueTimelineEvent");
	var user = mongoose.model('User', userSchema);
	user.find({_id: this._id}, function (err, res) {
		console.log(res);
	})
	//contact.update({phone:request.phone}, {$set: { phone: request.phone }}, {upsert: true}, function(err){...})
	//this.timeline.update({league_id: timeline.league_id, events.league_week: inputdata.league_week}, {$push: {events.event: inputdata.task}})

	//fungerar att ta ut en embedded array(genom robomongo konsollen): db.users.find({ "timeline.events.league_week" : 5},{'timeline.$': 1});
	this.save(function (err, result) {
		if (err){
			console.log(err);
			throw err;		
		}
		else
			callback();
	})

	/*var query = {
		_id: this._id, 
		"timeline.league_id": timeline.league_id
		//"timeline.events.league_week" : inputdata.league_week
	};
	user.update(
			query,
			{"timeline.$.temp": "ahaaaja"},
			{multi:false, upsert:true},
			function(err, result) {
				console.log("update callback");
				console.log(result);
			}
		)
	*/
	/* Måste på något sätt hitta ett embeddat document som refererar till en liga och en specefik vecka
	user.update(
        { _id: this._id , "timeline.league_id":timeline.league_id},
        { $push:{ "events.$.event":"newValue" } },
        { upsert: true }, 
        function(err, res){
        	console.log(err);
        }
    );*/
}




// create model for users and expose it for our app
module.exports = mongoose.model('User', userSchema);