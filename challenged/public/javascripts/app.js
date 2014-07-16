//app.js
var routerApp = angular.module('routerApp', ['ui.router', 'ui.bootstrap', 'ngGrid', 'ngBootstrap']);

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
		//============================================================
		// FRIENDS ===================================================
		//============================================================
		.state('friends', {
			url 		  : '/friends',
			templateUrl	  : '../pages/friends.html',
			controller 	  : 'friendController'
		});
})
	var serviceApp = angular.module('serviceApp', []); // keep services connected to this object
	var directiveApp = angular.module('directiveApp', []) // keep dircetives connected to this object
	var mainApp = angular.module('mainApp', ['routerApp', 'serviceApp', 'directiveApp']); // tha main app connected on the outer html element