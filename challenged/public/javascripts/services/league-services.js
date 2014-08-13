// league-services.js

serviceApp.factory('listLeaguesService', function($http) {
	return {
		getLeagues: function() {
			var promise = $http.get('/api/user/leagues')
				.success(function (result) {					
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
			schedules : {}
		},
		getExercises: function() {
				return leagueFormService.sharedObject.exerciseSchedule;
		},
		updateObject: function (exerciseSchedule_) {
				console.log(exerciseSchedule_);
				leagueFormService.sharedObject.exerciseSchedule = exerciseSchedule_;
				leagueFormService.sharedObject.schedules[exerciseSchedule_.schemaId] = exerciseSchedule_;
		},
		importSchedule: function (exerciseSchedule_) {
			leagueFormService.sharedObject.schedules[exerciseSchedule_._id] = exerciseSchedule_;
		},
		excludeImportedSchedule: function (exerciseSchedule_){
			delete leagueFormService.sharedObject.schedules[exerciseSchedule_._id];
		},
		getScheduleIds: function () {
			var ids = [];
			for (id in leagueFormService.sharedObject.schedules){
				ids.push(angular.fromJson(angular.toJson(leagueFormService.sharedObject.schedules[id])));

			}

			return ids;
		}
	};
	return leagueFormService;
});

serviceApp.factory('getTimelineService', function($http) {
	var getTimelineService = {
		sharedObject: {
			timeline : null
		},
		getTimeline: function(inputdata) {
			var promise = $http.get('/api/league/timeline/'+inputdata)
				.success(function (result) {
					console.log(result.timeline);
					angular.forEach(result.timeline, function(key) {
						console.log(typeof key.date);
						key.date = new Date(Date.parse(key.date));
						console.log(key.date.toString());
					});
					getTimelineService.sharedObject.timeline = result.timeline;					
					return getTimelineService.sharedObject.timeline;
				})
				.error(function (err) {
					return err;
				});
			return promise;
		},
		updateTimeline: function(newTimeline) {
			angular.forEach(newTimeline, function(key) {
				console.log(typeof key.date);
				key.date = new Date(Date.parse(key.date));
				console.log(key.date.toString());
			});
			getTimelineService.sharedObject.timeline = newTimeline;
		}
	};
	return getTimelineService;
});