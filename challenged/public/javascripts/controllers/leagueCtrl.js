//leagueCtrl.js

routerApp.controller('listLeaguesController', function ($scope, listLeaguesService, selectLeagueService){
	$scope.selectedLeague = selectLeagueService.sharedObject.selectedLeague;

	$scope.updateData = function(){
		listLeaguesService.getLeagues().then(function(promise) {
			$scope.leagues = promise.data;

			$scope.$$phase || $scope.$apply(); // <-- ny data, uppdatera scope/tabellen
		});
	}
	$scope.updateData();

	$scope.gridOptions = { 
      data: 'leagues',
      selectedItems: selectLeagueService.sharedObject.selectedLeague,
      multiSelect: false
	};

	$scope.selectedLeagueGridOptions = {
		data: 'selectedLeague[0].exerciseSchema.content'
	}

	console.log(selectLeagueService.sharedObject.selectedLeague);
	$scope.updateLeagueList = function () {
		$scope.updateData();
	}


});

routerApp.controller('createLeagueController', function ($scope, $http, $filter) {
	$scope.leagueData = {};
	$scope.date1;

	$scope.processLeague = function(isValid) {
		//console.log($scope.date1);


		//Check if form is valid
		if(isValid){
			console.log($scope.leagueData);

				$scope.leagueData.timeSpan = [$scope.date1.startDate.toJSON(), $scope.date1.endDate.toJSON()];
				console.log($scope.date1);
				console.log($scope.leagueData);
				console.log("league name -> " + $scope.leagueData.name);



				//$scope.leagueData.name is set through create-league-form.html

				$http({
					method	: 'POST',
					url		: '/api/createLeague',
					data 	: $.param($scope.leagueData),
					headers : {'Content-type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data) {
					$scope.$$phase || $scope.$apply();
					// Ugly temporary solution, a better way with separate controllers is to share a service
					angular.element(document.getElementById('user-league-list')).scope().updateLeagueList();
				
				}).
				error(function(data, status, headers, config) {
					console.log(data);
					console.log(status);

				});
		}
		else {
			//No name for league defined
			console.log("trying to save with missing input");
			$scope.leagueData.name='';
		}
	};
	
	$scope.today = function() {
		$scope.date1 = new Date();	
	};
	
	$scope.today();

	$scope.clear = function () {
		$scope.dt = null;
	}

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		console.log("start" + $scope.start);
		console.log("end" + $scope.end);
		$scope.opened = true;

	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	$scope.initDate = $scope.dt;
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

});









//================================================================================================
// League Controller for expanded information ====================================================
//================================================================================================
routerApp.controller('leagueController', function ($scope, $stateParams, $http, selectLeagueService) {
	$scope.league = selectLeagueService.sharedObject.selectedLeague[0];
	console.log($scope.league);
	// Page is probably refreshed, and we lost the selectedLeagueService
	if(!$scope.league){
		$http.get('/api/league/'+$stateParams.id).success(function (data) {
			$scope.league = data;
			console.log($scope.league);
		});	
		
	}


	$scope.leagueName = $stateParams.specificLeague;
	

});
