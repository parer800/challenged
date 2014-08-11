//app.js
var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'ngGrid', 'ngBootstrap', 'ui.bootstrap.datetimepicker']);

routerApp.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '../pages/home.html'
		})

		// nested list in home 
		.state('home.list', {
			url: '/list',
			templateUrl: '../pages/home-list.html',
			controller: function($scope) {
				$scope.dummydata = ['dummydata1', 'dummydata2', 'dummydata3'];
			}
		})

		.state('logout', {
			url: '/logout',
			controller: 'logoutController'
		})

		.state('home.paragraph' , {
			url: '/paragraph',
			template: 'Some paragraph!'
		})

		//============================================================
		// PROFILE ===================================================
		//============================================================
		.state('profile', {
			url: '/profile',
			views: {
				// main template will be placed here  (relatively named)
				'': {templateUrl: '../pages/profile.html'},

				// child view defined here (absolutely named)
				'columnOne@profile': {
					templateUrl: '../pages/profile/list-users.html',
					controller: 'listUsersController',
				},
			}
		})
		//============================================================
		// SETTINGS ==================================================
		//============================================================
		.state('settings', {
			url 		: '/settings',
			templateUrl : '../pages/settings.html'
		})

		//============================================================
		// ACCOUNT  ==================================================
		//============================================================
		.state('account', {
			url 		: '/account',
			templateUrl : '../pages/account.html',
			controller: function($scope) {
				$scope.dummydata = ["user's profile name"];
			}
		})
		//============================================================
		// LEAGUES ===================================================
		//============================================================
		.state('leagues', {
			url 		: '/leagues',
			views : {
				// main template will be placed here  (relatively named)
				'': {templateUrl: '../pages/leagues/leagues.html'},
				// child view defined here (absolutely named)
				'columnOne@leagues': {
					templateUrl: '../pages/leagues/league-table.html',
					controller: 'listLeaguesController',
				},
				'columnTwo@leagues': {
					templateUrl: '../pages/leagues/specific-league-column.html',
					controller: 'listLeaguesController',
				},
				'createLeagueForm@leagues' : {
					templateUrl: '../pages/leagues/create-league-form.html',
					controller: 'createLeagueController'
				}
				
			}
		})
		.state('league', {
			url: '/?specificLeague&id',
			templateUrl: '../pages/leagues/league.html',
			controller : 'leagueController'
			
		})
		//============================================================
		// FRIENDS ===================================================
		//============================================================
		.state('friends', {
			url 		  : '/friends',
			templateUrl	  : '../pages/friends.html',
			controller 	  : 'friendController'
		});
})
.run(function($rootScope, incomingService) {
    $rootScope.alerts = [];
    $rootScope.test = "TEST";
    $rootScope.incoming = [];
    
    //A way to look for new incoming messages on every route changed
    $rootScope.$on('$stateChangeSuccess', function () {
        incomingService.getIncoming();
        console.log("rootscope");
        console.log($rootScope.incoming);
    })   

})
.factory('incomingService', function($rootScope, $http) {
	return{
	    getIncoming : function () {
	        var promise = $http.get('/api/user/incoming')
	            .success(function (result) {
	                console.log(result)
	                $rootScope.incoming = result;
	                return result;
	            })
	            .error(function (err) {
	                return err;
	            });
	        return promise.data;
	    }		
	}
}); 
	var serviceApp = angular.module('serviceApp', []); // keep services connected to this object
	var directiveApp = angular.module('directiveApp', []) // keep dircetives connected to this object
	var mainApp = angular.module('mainApp', ['routerApp', 'serviceApp', 'directiveApp']); // tha main app connected on the outer html element

	