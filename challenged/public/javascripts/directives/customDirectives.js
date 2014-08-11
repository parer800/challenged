//customDirectives.js
/*
directiveApp.directive('schemasCollapse', function () {
	return {
		restrict: 'A',
		template: '<div class="panel-group" id="{{panelId}}">\
                       <div class="panel panel-default">\
                           <div class="panel-heading">\
                               <h4 class="panel-title">\
<a data-toggle="collapse" data-parent="#{{panelId}}" ui-sref="leagues({type: panelBaseId})">Panel Title 1</a>\
                               </h4>\
                           </div>\
<div id="{{panelBaseId}}-1" class="panel-collapse collapse">\
                               <div class="panel-body">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</div>\
                           </div>\
                       </div>\
                       <div class="panel panel-default">\
                           <div class="panel-heading">\
                               <h4 class="panel-title">\
<a data-toggle="collapse" data-parent="#{{panelId}}"  ui-sref="leagues({type: panelBaseId})">Panel Title 1</a>\
                               </h4>\
                           </div>\
<div id="{{panelBaseId}}-2" class="panel-collapse collapse">\
                               <div class="panel-body">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</div>\
                           </div>\
                       </div>\
                   </div>',
        link: function (scope, el, attrs) {
        	scope.panelBaseId = attrs.collapsePanelBodyId;
        	scope.panelId = attrs.collapsePanelBodyId;
        }
	};

});*/

directiveApp.directive('incomingMessage', function ($compile, confirmMessageService) {
 // <span class="text-muted small">{{message.date}}</span> (a time notation)
  var buttonGroup = '<button type="button" ng-click="confirmMessage($parent.$index)" class="btn btn-info btn-xs pull-right"><i class="fa fa-check"></i></button>'
  var leagueTemplate = '<div><i class="fa fa-trophy fa-fw"></i>Inbjuden till {{message.league.name}}'+buttonGroup+'</div>';
  var friendTemplate = '<div><i class="fa fa-user fa-fw"></i> {{message.from}}<span class="pull-right text-muted small">{{message.date}}</span></div>'
  var linker = function (scope, element, attrs) {
    element.html(getTemplate(scope.message.type)).show();
    scope.confirmMessage = function (message_index) {
      console.log("confirmMessage");
      console.log(scope.message);
      console.log(message_index);
      var inputData = {index: message_index};
      confirmMessageService.confirmInvetation(inputData);
    }
    $compile(element.contents())(scope);
  }

  var getTemplate = function (messageType) {
    var template = '';
    switch(messageType){
      case 'league':
        template = leagueTemplate;
        break;
      case 'friend':
        template = friendTemplate;
        break;
    }
    return template;
  }
  return {
    restrict: "E",
    replace: true,
    link : linker,
    scope: {
      message:'='
    }
  };
});
