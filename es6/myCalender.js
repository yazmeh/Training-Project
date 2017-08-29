define(['app','jquery','moment','daterangepicker'],function(app,$,moment) {
	app.directive('myCalender', [function(){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			 scope: {
			 	date: '=',
			 	lists: '='
			 }, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			 restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
			template: `<input type="text" id="abc">
			<div id="date-range12-container"></div>
			<button ng-click="specificOkClicked()">OK</button>
			<button ng-click="specificCancelClicked()"">Cancel</button>`,
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function(scope, iElm, iAttrs) {
				//console.log(scope,iElm,iAttrs);
				var input= $(iElm[0].childNodes[0]);
				
				
				var config={
					separator : ' to ',
					getValue: function()
						{
							return this.value;
						},
						setValue: function(s)
						{
							this.value = s;
						},
					format: 'YYYY-MM-DD',
					singleMonth:true ,
					inline:true,
					container: '#date-range12-container', 
					alwaysOpen:true 
				};


			input.dateRangePicker(config);
			input.data('dateRangePicker').setDateRange(scope.date.startDate,scope.date.endDate);


			scope.specificOkClicked =function() {
						scope.date.startDate=input.val().split(' to ')[0] + ' 00:00:00';
						scope.date.endDate=input.val().split(' to ')[1] + ' 00:00:00';
						for (var i = 0; i < scope.lists[0].people.length; i++) {
							if (scope.lists[0].people[i].name=='Time') {
								
								scope.lists[0].people[i].filteroptions=[];
						    	//console.log(scope.datePicker.date);
						    	
						    	scope.lists[0].people[i].filteroptions.push({
						    		startDate: moment(scope.date.startDate).format('YYYY-MM-DD HH:mm:ss'),endDate:moment(scope.date.endDate).format('YYYY-MM-DD HH:mm:ss')
						    	});
						    	scope.lists[0].people[i].filterselect=false;
						    	
						    	
						    	
							}
						}
						scope.$apply;
						//console.log(moment(start).format('YYYY-MM-DD HH:mm:ss'),end);
			}

			scope.specificCancelClicked =function() {
				//console.log(start.split(' ')[0],end.split(' ')[0]);	
				input.data('dateRangePicker').setDateRange(scope.date.startDate.split(' ')[0],scope.date.endDate.split(' ')[0]);
				scope.$apply;
			}

	
			}
		};
	}]);
})