// common controllers

routerApp.controller('logoutController', function($http, $location){
	$http.get('/logout')
	.success(function (result) {
		window.location.reload(); 
	});
});