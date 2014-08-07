//alert-service.js
'use strict';
serviceApp.factory('alertService', function($rootScope, $timeout) {

	var alertService;

	// array of alerts available globally
	$rootScope.alerts = [];
	$rootScope.getAlerts = function() {
    	return $rootScope.alerts;
    }
	return alertService = {
    add: function(type, msg, timeout) {
        $rootScope.alerts.push({
            type: type,
            msg: msg,
            close: function() {
                return alertService.closeAlert(this);
            }
        });

        if (timeout) { 
            $timeout(function(){ 
                alertService.closeAlert(this); 
            }, timeout); 
        }
    },
    closeAlert: function(alert) {
        return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
    },
    closeAlertIdx: function(index) {
        return $rootScope.alerts.splice(index, 1);
    }

};
});



