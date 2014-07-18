//user.js

//Load necessary stuff
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Exercise = require('./exercise');


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


// create model for users and expose it for our app
module.exports = mongoose.model('User', userSchema);