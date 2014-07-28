// user-services.js
// serviceApp located in app.js
serviceApp.factory('listUserService', function($http) {
	return {
		getUsers: function() {
			var promise = $http.get('/api/users')
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



serviceApp.factory('leagueWeekService', function () {
	return{
		getWeek: function (d1, d2) {
			var minutes = 1000 * 60;
			var hours = minutes * 60;
			var days = hours * 24;
			var weeks = days*7; // get number of milliseconds of a week
			console.log("getLeagueWeek");
			var diff = d2 - d1;
			console.log("diff: " + diff);
			var diff_days = Math.round(diff / days);
			var diff_week = Math.floor(diff_days/7);
			console.log("diff_week =" + diff_week);


		}
	}
});