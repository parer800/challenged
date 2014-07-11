// app/model/leagues.js
var User 	   = require('./user');
var mongoose = require('mongoose');


var leagueSchema = mongoose.Schema({
	name			: String,
	contenders		: [User],
	creator			: {
		type		: mongoose.Schema.Types.ObjectId,
		ref			: 'User'
	}
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
leagueSchema.methods.addContenders = function(_contenderlist) {
	leagueSchema.contenders.push(_contenderlist);
}



module.exports = mongoose.model('League', leagueSchema)