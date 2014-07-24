//exercise-services.js

serviceApp.factory('getExerciseService', function($http) {
	return {
		getExercises: function() {
			var promise = $http.get('/api/exerciseSchemas')
			.success(function (result) {
					return result
				})
			.error(function (err) {
					return err;
				});
			return promise;
		}
	}
});

/*
serviceApp.factory('getExerciseService', function($http) {
	return {
		getExercises: function() {
			var promise = $http.get('/api/exerciseSchemas')
				.success(function (result) {
					console.log(result);
					
					return result;
				})
				.error(function (err) {
					return err;
				});
			return promise;
		}
	}
});*/


serviceApp.factory('confirmExerciseService', function ($http) {
	return {
		confirmTask: function (inputdata){
			var promise = $http({
				method	: 'POST',
				url		: '/api/league/confirmed',
				data 	: $.param(inputdata),
				headers : {'Content-type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data) {
					console.log(data);
				
				}).
				error(function(data, status, headers, config) {
					console.log(data);
					console.log(status);

				});
			return promise;		
		}
	}

});