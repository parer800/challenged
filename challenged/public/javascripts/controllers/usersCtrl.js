// user controller

routerApp.controller('listUsersController', function($scope, listUserService){
	//let service call for data and when finished, use it in this controller.
	listUserService.getUsers().then(function(promise) {
		console.log(promise.data);
		$scope.users = promise.data;
	});
});
