//customDirectives.js

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

});