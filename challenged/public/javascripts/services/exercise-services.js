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

serviceApp.factory('confirmExerciseService', function ($http, getTimelineService, alertService) {
	return {
		confirmTask: function (inputdata, callback){
			var promise = $http({
				method	: 'POST',
				url		: '/api/league/confirmed',
				data 	: $.param(inputdata),
				headers : {'Content-type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data) {
					console.log(data);
					getTimelineService.updateTimeline(data.timeline);
					alertService.add("success", data.statusMessage);
					if(callback) callback();				
				}).
				error(function(data, status, headers, config) {
					console.log(data);
					console.log(status);
					alertService.add("error", data);

				});
			return promise;		
		},
		weeklyConfirmed : function (inputdata) {

			var promise = $http.get('/api/league/confirmedevents/'+inputdata.league_id+'/'+inputdata.league_week)
			.success(function (result) {
					console.log(result);
					return result
				})
			.error(function (err) {
					return err;
				});
			return promise;
		}
	}

});