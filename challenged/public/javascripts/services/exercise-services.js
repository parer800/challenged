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