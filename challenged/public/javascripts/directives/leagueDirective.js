//league-directive.js

//this is currently connected to the router app because it is dependent on ui.bootstrap.datetimepicker
routerApp.directive('confirmPopover', function ($compile,$templateCache, confirmExerciseService, leagueWeekService) {
return {
    restrict: "A",
    link: function (scope, element, attrs) {

        var popOverContent;
        popOverContent = $templateCache.get("weeklyTaskList.html");     
        
        popOverContent = $compile("<div>" + popOverContent+"</div>")(scope);
        scope.confirmTask=function(){
        	console.log("clicking");
        	var jsonString = angular.toJson(scope.task); // erase angular hashkey, will return a string
        	scope.data.task = angular.fromJson(jsonString); // make jsonObject again
        	console.log(scope.league);
        	var startDate = new Date(scope.league.duration[0]);
        	var date = scope.data.date;
        	var leagueWeekNr = leagueWeekService.getWeek(startDate, date);
        	scope.data.league_week = leagueWeekNr;
        	console.log(scope);
        	confirmExerciseService.confirmTask(scope.data, function () {
        		scope.alreadyConfirmed.push(scope.data.task._id);
        	});
        }
        var options = {
            content: popOverContent,
            placement: "right",
            html: true,
            date: scope.date
        };
        $(element).popover(options);

	 scope.today = function() {
	    scope.dt = new Date();
	  };

	 // scope.today();

	  scope.clear = function () {
	    scope.dt = null;
	  };

	  // Disable weekend selection
	  scope.disabled = function(date, mode) {
	    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  };

	  scope.toggleMin = function() {
	    scope.minDate = scope.minDate ? null : new Date(scope.league.duration[0]);
	  };
	  scope.toggleMin();

	  scope.open = function($event) {
	  	console.log("scope.task");
	    $event.preventDefault();
	    $event.stopPropagation();
	    scope.opened = true;
	  };

	  

	  scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	  };

	  scope.initDate = new Date('2016-15-20');
	  scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  scope.format = scope.formats[0];
    }
};

});
