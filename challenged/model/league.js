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
	contenders		: [{
		type	: mongoose.Schema.Types.ObjectId,
		ref		: 'User'
	}],
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

leagueSchema.methods.addLeagueReferenceToUser = function (user, callback) {
	console.log("!!! addLeagueReferenceToUser");
	console.log(this._id);
	console.log(user);
	this.model('User').findByIdAndUpdate(user, 
		{$push: {league : this._id}, upsert:true},
		function(err, obj){
			if(err)
				console.log(err);
			if(!obj)
				console.log("cannot save");
			
			//result message

			var status_message = "User has been added to league"; 
			callback(status_message);
			
		}					  
	);

	/*this.model('User').findOne({_id: user}, function (err, user) {
		user.league.push(this._id);
		user.save(function (err) {
			if (err)
				throw err;

			var status_message = "User has been added to league"; 
			callback(status_message);
		});

	});*/
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
		else{
			req.user.addLeagueTimelineEvent(this, inputdata, function(){
				callback();
			});			
		}
	})
	
}


leagueSchema.methods.addContenders = function(_contenderlist) {
	leagueSchema.contenders.push(_contenderlist);
}



module.exports = mongoose.model('League', leagueSchema)