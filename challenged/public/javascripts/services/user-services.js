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