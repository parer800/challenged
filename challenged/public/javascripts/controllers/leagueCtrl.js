//leagueCtrl.js

routerApp.controller('listLeaguesController', function ($scope, listLeaguesService, selectLeagueService){
	$scope.selectedLeague = selectLeagueService.sharedObject.selectedLeague;

	$scope.updateData = function(){
		listLeaguesService.getLeagues().then(function(promise) {
			$scope.leagues = promise.data;
			//$scope.$apply();

			$scope.$$phase || $scope.$apply();
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

routerApp.controller('createLeagueController', function ($scope, $http, $filter, leagueFormService) {
	$scope.leagueData = {};
	$scope.date1;
	$scope.schemaIsAttached;
	

	$scope.attachedSchema = {};
	$scope.attachedSchema.open = false;
	$scope.service = leagueFormService;
	$scope.$watch('service.sharedObject.exerciseSchedule', function (newValue) {
		console.log(newValue);
		if(newValue != null){
        	$scope.attachedSchema.name = newValue.name;
        	$scope.attachedSchema.content = newValue.content;
		}

    });



	$scope.processLeague = function(isValid) {
		//console.log($scope.date1);

		if(isValid){
			console.log($scope.leagueData);


			//Check whether an exercise schema has been added
			console.log(leagueFormService.getExercises());
			if(leagueFormService.getExercises() == null){
				$scope.schemaIsAttached = false;
			}
			else{

				//Bind exerciseSchema to leagueData
				$scope.leagueData.exerciseSchemaId = leagueFormService.getExercises().schemaId;
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
					
					console.log("leagueFormService.getExercises()");
					console.log(leagueFormService.getExercises());
					// Ugly temporary solution, a better way with separate controllers is to share a service
					angular.element(document.getElementById('user-league-list')).scope().updateLeagueList();
					/*if(!data.success) {
						$scope.errorName = data.errors.name;
					}
					else{
						$scope.message = data.message;
					}*/
				
				}).
				error(function(data, status, headers, config) {
					console.log(data);
					console.log(status);

				});
			}
		}
		else {
			console.log("trying to save with missing input");
			$scope.leagueData.name='';
		}
		//DatePicker
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






/*==================================================================================
============================== CREATE NEW SCHEMA ====================================
====================================================================================*/
routerApp.controller('taskController', function ($scope, $modal, $log) {
	$scope.tasks = ['strengh', 'running', 'other'];
	
	$scope.currentStatugridOptionss = null;
	$scope.exercises = [
		{
            "type": "stamina",
             "subtypes": [
	                {"subtype": "length",
	            	 "unit" : "number"
	            	},
	                {"subtype": "duration",
	            	 "unit" : "time"
	            	}
             ]
        },
        {
           "type": "strength",
             "subtypes": [
	                {"subtype": "reps",
	            	 "unit" : "number"
	            	},
	                {"subtype": "weight",
	            	 "unit" : "number"
	            	}
             ]
        }
  	];

	$scope.statuses = [
		{value: 1, text: 'stamina'},
		{value: 2, text: 'strength'}
	];

	$scope.subtypes = [
		{value: 1, text: 'length'},
		{value: 2, text: 'duration'},
		{value: 3, text: 'reps'},
		{value: 3, text: 'weight'}
	];

	$scope.newSchema = {name: "Name of exercise schema", content: []};
	$scope.gridOptions = { data: 'newSchema.content' };




	$scope.open = function (size) {

		var modalInstance = $modal.open({
			templateUrl : 'createSchemaModalContent.html',
			controller  : CreateSchemaModalInstanceCtrl,
			size 	    : size,
			resolve     : {
				exercises   : function () {
					return $scope.exercises;
				}, 
				statuses   : function () {
					return $scope.statuses;
				},
				statuses2   : function () {
					return $scope.statuses2;
				},
				subtypes	: function () {
					return $scope.subtypes;
				},
				newSchema	: function () {
					return $scope.newSchema;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

	};

});

//modal instance for create schema
var CreateSchemaModalInstanceCtrl = function ($scope ,$modalInstance, $filter, $http, exercises, statuses, newSchema, subtypes, leagueFormService) {
	$scope.statuses = statuses;
	$scope.exercises = exercises;
	$scope.subtypes = subtypes;
	$scope.duration = new Date();
	$scope.currentStatus = null;
	$scope.newSchema = newSchema;
	$scope.schedule = {
		schemaName: newSchema.name,
        type:"",
        name:"",
        subtype:"",
        amount:""
    };

   

    $scope.gridOptions = { 
    	data: 'newSchema.content',
    	enableCellSelection: true,
      	enableRowSelection: false,
      	columnDefs: [{field: 'name', displayName: 'Name'}, 
      				{field:'type', displayName:'Type of training'},
      				{field:'subtype', displayName:'Subtype'},
      				{field:'amount', displayName:'Amount'},

      				]
    };
    $scope.typess ="";
	$scope.changed = function() {

	};

	$scope.showsomething = function(data) {
		console.log(data);
	}


	$scope.checkName = function(data, id) {
	  /*  if (id === 2 && data !== 'awesome') {
	      return "Username 2 should be `awesome`";
	    }*/
	  };

	$scope.addExercise = function(type) {
		
		$scope.$$phase || $scope.$apply();
		$scope.newSchema.content.push({
			id: $scope.newSchema.content.length+1,
			name: $scope.schedule.name,
			type: $scope.schedule.type.type,
			subtype : $scope.schedule.subtype.subtype,
			amount : $scope.schedule.amount
		});

		console.log( $scope.newSchema.content);
	};

	$scope.ok = function () {
		$scope.newSchema.name = $scope.schedule.schemaName;
		console.log("TRYING TO SAVE");
		console.log($scope.newSchema.schemaId);
		console.log($scope.newSchema);
		console.log(leagueFormService.sharedObject.exerciseSchedule);
		//save schema on server
		$http({
			method	: 'POST',
			url		: '/api/createSchema',
			data 	: $.param($scope.newSchema),
			headers : {'Content-type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status) {
			console.log(data);
					// Add everything to outer Object since everything was succesfully stored, add notificattions etc..

					$scope.newSchema.schemaId = data.object._id; // set id of newly created schema, we are going to pass this instead of the schema objects since it is already stored in database...
					leagueFormService.updateObject($scope.newSchema);
		
		}).
		error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
		});




		$modalInstance.close();
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};
/*==================================================================================
============================== /////////////////////// =============================
====================================================================================*/



/*==================================================================================
============================== IMPORT SCHEMA =======================================
====================================================================================*/
routerApp.controller('importSchemaController', function ($scope, $modal, $log, getExerciseService) {
	$scope.exerciseSchemas = null;

	getExerciseService.getExercises().then(function (promise) {
		$scope.exerciseSchemas = promise.data.ExerciseSchema;
		$scope.isOpen = Array.apply(0, Array($scope.exerciseSchemas.length)).map(Boolean).map(Number); // init an array of booleans, used by accordion in gui
		
		$scope.exerciseSchemas.forEach(function(schema) {
		    console.log(schema);
		    schema.open = false;
		});


		$scope.$$phase || $scope.$apply();



		console.log("loading user connected schemas");
		console.log($scope.exerciseSchemas);
	});


	$scope.open = function (size) {

		var modalInstance = $modal.open({
			templateUrl : 'importSchemaModalContent.html',
			controller  : ImportSchemaModalInstanceCtrl,
			size 	    : size,
			resolve     : {
				exerciseSchemas   : function () {
					return $scope.exerciseSchemas;
				}
			}
		});
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

	};
});

//modal instance for import schema
var ImportSchemaModalInstanceCtrl = function ($scope ,$modalInstance, $filter, $http, exerciseSchemas)
{
	$scope.exerciseSchemas = exerciseSchemas; // this is used in the importSchemaModalContent
	$scope.ok = function () {
		$modalInstance.close();
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}



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
