// app/model/leagues.js
var User 	   = require('./user');
var Exercise   = require('./exercise');
var mongoose = require('mongoose');


var TimelineComponent = new mongoose.Schema({ date: 'Date',
											  user: 'String',
											  task: 'Mixed',
											  details: 'Mixed'
											}, {
												  _id: false // no need to geneterate _id column for this document.
											});

var UserComponent = new mongoose.Schema({ profile: 'Mixed',
										  _id: {
											type		: mongoose.Schema.Types.ObjectId,
											ref			: 'User'
										  }
										},
										{
											_id: false // no need to geneterate _id column for this document.
										});

var leagueSchema = mongoose.Schema({
	name			: String,
	contenders		: [{
		type	: mongoose.Schema.Types.ObjectId,
		ref		: 'User'
	}],
	invitations 	: [{
		type	: mongoose.Schema.Types.ObjectId,
		ref		: 'User'
	}],
	duration		: ['Date'],
	creator			: [UserComponent],
	exerciseSchema	: ['Exercise'],
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

leagueSchema.methods.addLeagueInvetationToUser = function (invitaion_component, callback) {
	this.model('User').findByIdAndUpdate(invitaion_component.to, 
		{$push: {incoming : invitaion_component}, upsert:true},
		function(err, obj){
			if(err)
				console.log(err);
			if(!obj)
				console.log("cannot save");
			
			//result message

			var status_message = "User has been invited to league"; 
			callback(status_message);
			
		}					  
	);
}

leagueSchema.methods.addLeagueReferenceToUser = function (user, callback) {
	console.log("!!! addLeagueReferenceToUser");
	console.log(this._id);
	this.model('User').findByIdAndUpdate(user, 
		{$push: {league : this._id}, upsert:true},
		function(err, obj){
			if(err)
				console.log(err);
			if(!obj)
				console.log("cannot save");
			
			//result message

			var status_message = "User has been invited to league"; 
			callback(status_message);
			
		}					  
	);
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