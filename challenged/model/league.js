// app/model/leagues.js
var User 	   = require('./user');
var Exercise   = require('./exercise');
var mongoose = require('mongoose');


var TimelineComponent = new mongoose.Schema({ date: 'Date',
											  user: 'String',
											  task: 'Mixed',
											  details: 'Mixed'
											}, {
												  _id: false
											});


var leagueSchema = mongoose.Schema({
	name			: String,
	contenders		: [User],
	duration		: ['Date'],
	creator			: {
		type		: mongoose.Schema.Types.ObjectId,
		ref			: 'User'
	},
	exerciseSchema	: [{
		type	: mongoose.Schema.Types.ObjectId,
		ref		: 'Exercise'
	}],
	timeline		: [TimelineComponent]
});

leagueSchema.methods.addLeague = function(res) {
	//var league = new LeagueSchema(name: _name, creator : _creator );
	console.log("insiiiide");

	this.save(function(err, result) {
		if (err){
			res.status(400).send("error");
		}
		else{
			console.log("success: " + JSON.stringify(this));
			res.send({object : result});
		}
	})
	//Store data
}

leagueSchema.methods.confirmedEvent = function (req, callback) {
	var inputdata = req.body;
	var user = req.user.profile.name;
	console.log("confirmedEvent");
	console.log(inputdata.task);
	var timeline = {};
	timeline.date = inputdata.date;
	timeline.user = user;
	console.log(typeof inputdata.task);
	timeline.task = inputdata.task;
	this.timeline.push(timeline);
	this.save(function (err, result) {
		if (err){
			console.log(err);
			throw err;		
		}
		else
			callback();
	})
	
}


leagueSchema.methods.addContenders = function(_contenderlist) {
	leagueSchema.contenders.push(_contenderlist);
}



module.exports = mongoose.model('League', leagueSchema)