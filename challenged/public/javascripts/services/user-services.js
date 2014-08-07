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

serviceApp.factory('userService', function($http) {
	var userService = {
		sharedObject :{
			currentUser: null
		},
		getUser: function() {
			var promise = $http.get('/api/user')
				.success(function (result) {
					userService.sharedObject.currentUser = result;
					return result;
				})
				.error(function (err) {
					return err;
				});
			return promise;
		}
	};
	return userService;
});

serviceApp.factory('leagueWeekService', function () {
	return{
		getWeek: function (d1, d2) {
			var minutes = 1000 * 60;
			var hours = minutes * 60;
			var days = hours * 24;
			var weeks = days*7; // get number of milliseconds of a week
			var m1 = moment(d1);
			var m2 = moment(d2);
			m1.startOf("isoWeek"); // League week start on monday
			m2.endOf("isoWeek"); // League Week ends on sunday
			console.log("getLeagueWeek");
			console.log(m1);
			console.log(m2);
			var diff = m2 - m1;
			
			var diff_days = Math.round(diff / days);
			console.log("diff in days: " + diff_days);
			var diff_week = diff_days/7
			console.log("diff_week =" + diff_week);

			return diff_week; //This will indicate how many "league-weeks" it is between two dates
		}
	}
});