// app/model/exercise.js

var User 	   = require('../model/user');
var mongoose = require('mongoose');

var ExerciseComponent = new mongoose.Schema({ name: 'string', type: 'string',  subtype: 'string', amount: 'string'});



var ExerciseSchema = mongoose.Schema({
	content		: [ExerciseComponent],
	name		: String,
	creator		: {
		type	: mongoose.Schema.Types.ObjectId,
		ref		: 'User'
	}
});
/*

ExerciseSchema.post('save', function (doc, req) {
	//Store schema reference in user
	console.log("inside post save");
	console.log(req);
	var userid = doc.creator
	User.update({_id : userid}, 
				{$push: {ExerciseSchema : doc._id}}					  
     );


})
*/
ExerciseSchema.methods.addConnectionToUser = function (userid, req, callback) {
	console.log(this.User);
	callback();
}

ExerciseSchema.methods.addExercise = function(res) {

	this.save(function(err, result) {
		if (err) 
			res.send({'error':'An error has occurred'});
		else{
			console.log("success: " + JSON.stringify(this));
			res.send(result[0]);

		}
	})	

}


module.exports = mongoose.model('Exercise', ExerciseSchema)