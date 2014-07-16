// league-services.js

serviceApp.factory('listLeaguesService', function($http) {
	return {
		getLeagues: function() {
			var promise = $http.get('/api/leagues')
				.success(function (result) {
					console.log(result)
					
					return result;
				})
				.error(function (err) {
					return err;
				});
			return promise;
		}
	}
});

serviceApp.factory('selectLeagueService', function () {
	var selectLeagueService = {
		sharedObject :{
			selectedLeague: []
		},
		updateObject: function (selectLeague_) {
			console.log("update selected league");
			console.log(this);
			selectLeagueService.sharedObject.selectLeague = selectLeague_;
		}
	};
	return selectLeagueService;
});

serviceApp.factory('leagueFormService', function () {
	
	var leagueFormService = {
		sharedObject: {
			exerciseSchedule : null,
			schedules : []
		},
		getExercises: function() {
				console.log("getExercises");
				return leagueFormService.sharedObject.exerciseSchedule;
		},
		updateObject: function (exerciseSchedule_) {
				leagueFormService.sharedObject.exerciseSchedule = exerciseSchedule_;
				leagueFormService.sharedObject.schedules.push(exerciseSchedule_);
		}
	};
	return leagueFormService;
});