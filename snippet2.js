$scope.datePicker = { date: {startDate:'2017-08-09 07:51:02',endDate: '2017-08-19 07:51:02'}};
     

     $scope.request={
     	
					  namespace: "Header Bidder",
					  granularity:"3600000",
					  metrics: [],
					  filters:[],
					  dimensionObjectList: [
					    /*{
					      "dimension": "Country Code",
					      "threshold": 5
					    }*/
					  ],
					  orderingMetric: "",
					  startTime: "2017-08-09 07:51:02",
					  endTime: "2017-08-09 13:51:03"
     };

     $scope.jreq=JSON.stringify($scope.request);
     $scope.dimensions=[{
            label: "Dimensions",
            allowedTypes: ['dimensions'],
            people: [
            	/*{name:saf,type:dim,threshold:5,thresholdselect}*/
            ]
        	}];


    $scope.measures=[{
            label: "Measures",
            allowedTypes: ['Measures'],
            people: []
        }
        ];  	

		callserver.calldim().then(function(response) {
			for (var i=0;i<response.data.result.length;i++) {
				
					$scope.dimensions[0].people.push({name:response.data.result[i].dimensionName,type:"dimensions",threshold:5,thresholdselect:false,filterselect:false,filteroptions:[],filtertype:'in'});
				}	
		},function(response) {
			console.log(response);
		});


		callserver.callmeas().then(function(response) {
			
			for (var i=0;i<response.data.result.length;i++) {
				
					$scope.measures[0].people.push({name:(response.data.result[i].alias).replace(' (HB Rendered Ad)',''),type:"Measures"});
				}
		},function(response) {
			console.log(response);
		});

	







    $scope.lists = [
        {
            label: "Filters",
            allowedTypes: ['dimensions'],
            people: [
                {name: "Time", type: 'dimensions',threshold:5,filterselect:false,filtertype:'Relative',filteroptions:[/*{fname:'',selected:true}*/],filtersearch:'6H'}
            ]
        },
        {
            label: "Split",
            allowedTypes: ['dimensions'],
            people: [
                
            ]
        },
        {
            label: "Values",
            allowedTypes: ['Measures'],
            people: [
                
            ]
        },
        

    ];

    $scope.filterclickok =function($event,person,list){
	    if(person.filtertype!='regex'){
	    flag=1;	//Non selected	
	    	for(var i=0;i<person.filteroptions.length;i++){
	    		if (person.filteroptions[i].selected) {
	    			flag=0;//atleast one selected
	    			break;
	    		}
	    	}
	    	if(flag){
	    		for (i = 0; i < list.people.length; i++) {
	    			if(list.people[i].name==person.name)
	    				list.people.splice(i,1);	
	    		}
	    	}
	    	else{
	    		console.log('from ok filters in');
	    	}

	    	
	    }
	    else{
	    	console.log('state.go from filter regex');
	    }
	    person.filterselect=false; 
	    
    }

    $scope.setspecificdate= function(person){
    	person.filteroptions=[];
    	//console.log($scope.datePicker.date);
    	try{
    	person.filteroptions.push({
    		startDate: moment($scope.datePicker.date.startDate).format('YYYY-MM-DD HH:mm:ss'),endDate:moment($scope.datePicker.date.endDate).format('YYYY-MM-DD HH:mm:ss')
    	});
    	person.filterselect=false;
    	person.filtersearch="";
    	}
    	catch(e){
    		alert('select some date');
    	}

    }

    $scope.filterclickcan= function($event,person,list){

    }
    
    $scope.splitfilterclicked = function(event,list,peopleValue){
    	if (list.label=="Split") {
    		list.people[$(event.target).closest('li').index()].thresholdselect=true;
    	}
    	else if (list.label=="Filters") {

    		if (peopleValue.name=='Time') {
    			peopleValue.filterselect=true;

    			if(peopleValue.filtertype=='Specific'){
	    			peopleValue.filteroptions=[];
	    			peopleValue.filteroptions.push({
	    			startDate: $scope.datePicker.date.startDate.format('YYYY-MM-DD HH:mm:ss'),endDate:$scope.datePicker.date.endDate.format('YYYY-MM-DD HH:mm:ss')	
	    			});
    			}

    		}

    		if ($scope.lists[2].people.length>0 && peopleValue.name!='Time') {
    			peopleValue.filterselect=true;
    			var requestforfilter={
					  "namespace": "Header Bidder",
					  "metrics": [],
					  "filters": [
					    /*{
					      "dimension": "Customer Name",
					      "values": [
					        "Forbes.com (Mobile)",
					        "Forbes PE Project"
					      ],
					      "type": "in"
					    }*/],
					  "dimensionObjectList": [
					    {
					      "dimension": peopleValue.name,
					      "threshold": 200
					    }
					  ],
					  "orderingMetric": $scope.lists[2].people[0].name.concat(' (HB Rendered Ad)'),
					  "startTime": $scope.request.startTime,
					  "endTime": $scope.request.endTime	
					};


					



					for (var i =0;i< $scope.lists[2].people.length; i++) {
			        	requestforfilter.metrics.push($scope.lists[2].people[i].name.concat(" (HB Rendered Ad)"));		
			        }


			        	
					for (var i = 0; i < $(event.target).closest('li').index(); i++) {
						
						if($scope.lists[0].people[i].name!='Time'){
							let obj={
								dimension: $scope.lists[0].people[i].name,
								values:[],
								pattern:"",
								type:$scope.lists[0].people[i].filtertype
							};
							if ($scope.lists[0].people[i].filtertype=='regex') {
								delete obj.values;
								obj.pattern=$scope.lists[0].people[i].filtersearch;
								requestforfilter.filters.push(obj);	
							}
							else{
							var count=0;
							delete obj.pattern;
								for(var j=0;j<$scope.lists[0].people[i].filteroptions.length;j++){
									
									if ($scope.lists[0].people[i].filteroptions[j].selected) {
										count++;
										obj.values.push($scope.lists[0].people[i].filteroptions[j].fname);
									}
								}
								if (obj.values.length>0&&count!=0) {
								requestforfilter.filters.push(obj);	
							}
							}

							
									
						}
					}
					console.log(JSON.stringify(requestforfilter));
					callserver.callquery(JSON.stringify(requestforfilter)).then(function(response){
						console.log(response);
						
						peopleValue.filtertype='in';
						var filterops=[]; //updating filteroptions
						
						for (i = 0; i < response.data.result.split.length; i++) {
							var flag=0;//did not get the option
							for(j=0;j<peopleValue.filteroptions.length;j++){
								if(peopleValue.filteroptions[j].fname==response.data.result.split[i][peopleValue.name]){
									filterops.push({fname:response.data.result.split[i][peopleValue.name],selected:peopleValue.filteroptions[j].selected});
									flag=1;

									break;
								}
							}
							if(!flag){
									filterops.push({fname:response.data.result.split[i][peopleValue.name],selected:false});
							}
						}
						peopleValue.filteroptions=[];
						for (i = 0; i < filterops.length; i++) {
							peopleValue.filteroptions[i]=filterops[i];
						}
						

					},function(response){
						console.log(response);
					});

			}	
    	}
    	//$scope.liststhresholdselect
    	
    }

        $scope.dropCallback= function(index, item, external, type,list){
        	
	        	var indexes=$scope.containsObject(list.people,item);
	        	indexes.splice(indexes.indexOf(index),1);
	        	
	        	
	        	if(indexes.length>0){
	        		
	        			list.people.splice(indexes[0],1);
	        		
	        		
        	   }
        }

        $scope.containsObject=function(values,item) {
		    var valueArr = values.map(function(item){ return item.name });
		  
		    var indexes=[];
			var isDuplicate = valueArr.filter(function(element, index){
			    	if (element===item.name) {
			    		indexes.push(index);
			    		return index;
			    	}  
			});
			return indexes;
			
		}

	
	$scope.$watch('lists[0]',function(lists,old){
		
		$scope.request.filters=[];
		
		 for (var i = 0; i < $scope.lists[0].people.length; i++) {

			if ($scope.lists[0].people[i].name=='Time') {
				var oldstart=$scope.request.startTime;
				var oldend=$scope.request.endTime;
				if ($scope.lists[0].people[i].filtertype=='Specific') {
					try{
						$scope.request.startTime=$scope.lists[0].people[i].filteroptions[0].startDate;
						$scope.request.endTime=$scope.lists[0].people[i].filteroptions[0].endDate;
					}
					catch(e){
						$scope.request.startTime=moment($scope.datePicker.date.startDate).format('YYYY-MM-DD HH:mm:ss');
						$scope.request.endTime=moment($scope.datePicker.date.endDate).format('YYYY-MM-DD HH:mm:ss');
					
					}
				}
				else if ($scope.lists[0].people[i].filtertype=='Relative'){
					var option=$scope.lists[0].people[i].filtersearch;
					var startTime= moment().format('YYYY-MM-DD HH:mm:ss');
					var endTime='';
					if (option=='1H') {
						endTime=moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
					}
					else if (option=='6H') {
						endTime=moment().subtract(6, 'hours').format('YYYY-MM-DD HH:mm:ss');	
					}
					else if (option=='1D') {
						endTime=moment().subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss');	
					}
					else if (option=='LCD') {
						startTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
						endTime=moment().format('YYYY-MM-DD 00:00:00');
						
					}
					else if (option=='LCW') {
						endTime=moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
						startTime=moment().format('YYYY-MM-DD 00:00:00');
						
					}
					else if (option=='LPD') {
						endTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
						startTime=moment().subtract(2, 'days').format('YYYY-MM-DD 00:00:00');
					}
					else if (option=='LPW') {
						endTime=moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
						startTime=moment().subtract(14, 'days').format('YYYY-MM-DD 00:00:00');
					}
					$scope.request.startTime=startTime;
					$scope.request.endTime=endTime;
		
				}
				if (!(oldstart===$scope.request.startTime&&oldend===$scope.request.endTime)) {
				console.log('satte.go from filter time');
				}
			}	
			else{
					
							let obj={
								dimension: $scope.lists[0].people[i].name,
								values:[],
								pattern:"",
								type:$scope.lists[0].people[i].filtertype
							};
							if ($scope.lists[0].people[i].filtertype=='regex') {
								delete obj.values;
								obj.pattern=$scope.lists[0].people[i].filtersearch;
								$scope.request.filters.push(obj);
							}
							else{
								var count=0;
								delete obj.pattern;
								for(var j=0;j<$scope.lists[0].people[i].filteroptions.length;j++){
									
									if ($scope.lists[0].people[i].filteroptions[j].selected) {
										count++;
										obj.values.push($scope.lists[0].people[i].filteroptions[j].fname);
									}
								}
								if (obj.values.length>0&&count!=0) {
								$scope.request.filters.push(obj);	
							}
							}
							
							
			}			
		}

	},true);	


	$scope.$watch('lists[1]',function(lists,old){
		
		$scope.request.dimensionObjectList=[];

        var flagforgranularity=0;
        for (i =0;i< $scope.lists[1].people.length; i++) {
        	if ($scope.lists[1].people[i].name==='Time'&&$scope.lists[1].people[i].granularity) {
        		$scope.request.granularity=$scope.lists[1].people[i].granularity;
        		flagforgranularity=1;
        	}
        	$scope.request.dimensionObjectList.push({'dimension':$scope.lists[1].people[i].name,'threshold':$scope.lists[1].people[i].threshold});		
        }

		if (!flagforgranularity) {
       	 $scope.request.granularity=3600000;
        }

     	  console.log('from dimensions');
	},true);	

	$scope.$watch('lists[2]',function(lists,old) {
		
		$scope.request.metrics=[];

		for (var i =0;i< $scope.lists[2].people.length; i++) {
        	$scope.request.metrics.push($scope.lists[2].people[i].name.concat(" (HB Rendered Ad)"));		
        }
         if ($scope.lists[2].people.length) {
        	$scope.request.orderingMetric=$scope.lists[2].people[0].name.concat(" (HB Rendered Ad)");
       	 }
       console.log('from measures');
	},true);