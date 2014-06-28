// Will hold the database connection and event listeners

// Bring Mongoose into the app
var mongoose = require('mongoose');

//Build the connection string
var dbURI = "mongodb://localhost/challanged";

module.exports = {
	url : dbURI,
	mongoose : mongoose
};




//CONNECTION EVENTS
// When establashing successful connection
mongoose.connection.on('connected', function () {
	console.log("Mongoose default connection open to " + dbURI);
});

//If connection fails and throws an error
mongoose.connection.on('error', function(err){
	console.log('Mongoose default connection error: ' + err);
});

//If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected throuh app termination');
		process.exit(0);
	});
});

//LOAD SCHEMAS & MODELS
