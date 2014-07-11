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
