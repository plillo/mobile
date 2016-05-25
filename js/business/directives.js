'use strict';
angular.module('business.directives', ['ngFileUpload']);

//ADD 'appSearchCategories' directive
//...................................
angular.module('business.directives').directive('appSearchCategories', function(business) {
	return {
		replace: false,
		scope: {
			categoriesSelected: '=categoriesSelectedAttr'
		},
		templateUrl : 'templates/business/categories/search-categories.html',
		controller: function($scope, $window, $element){
	       	// insert here scope-properties
			// ...
			$scope.results = [];
			
	       	// insert here scope-functions
			// ...
			$scope.select = function(index) {
				$scope.categoriesSelected.push($scope.results[index]);
				$scope.results.splice(index,1);
			}
			
			$scope.unselect = function(index) {
				$scope.results.push($scope.categoriesSelected[index]);
				$scope.categoriesSelected.splice(index,1);
			}
			
			$scope.change = function(event) {
				var searchString = $(event.target).val();

				business.getCategoriesBySearchKeyword(searchString).then(
				   function successCallback(response) {
					   $scope.results = response.data;
		           },
		           function errorCallback(response) {
			    	  alert('KO');
		           });
			}
	    },
		link: function(scope, element, attributes){
 			// EVENTS BINDING
 			element.find('#search').bind('change', scope.change);
		}
	};
});

//ADD 'appSearchBusiness' directive
//.................................
angular.module('business.directives').directive('appSearchBusiness', function(business) {
	return {
		replace: false,
		scope: {},
		templateUrl : 'templates/business/business/search-business.html',
		controller: function($scope, $state, $window, $element, haBackend){
	       	// scope-properties
			$scope.results = [];
        	$scope.urlBackend = haBackend.getBackend();
			
	       	// insert here scope-functions
			// ...
			$scope.select = function(index) {
			};
			
			$scope.change = function(event) {
				var searchString = $(event.target).val();

				business.getNotFollowedBusiness(searchString).then(
				    function successCallback(response) {
					    $scope.results = response.data.businesses;
		            },
		            function errorCallback(response) {
			    	    alert('KO');
		            });
			};
			
			$scope.follow = function(uuid) {
				business.followBusiness(uuid).then(
				    function successCallback(response) {
				    	$state.go('app.subscriptions');
		            },
		            function errorCallback(response) {
		            	alert('KO');
		            });
			};
	    },
		link: function(scope, element, attributes){
			// EVENTS BINDING
			element.find('#search').bind('change', scope.change);
		}
	};
});

//ADD 'appFollowedBusiness' directive
//...................................
angular.module('business.directives').directive('appFollowedBusiness', function(business) {
	return {
		replace: false,
		scope: {},
		templateUrl : 'templates/business/business/followed-business.html',
		controller: function($scope, $state, $window, $element, haBackend){
	       	// scope-properties
			$scope.results = [];
        	$scope.urlBackend = haBackend.getBackend();
        	$scope.rand = ''+ Math.random();
			
	       	// insert here scope-functions
			// ...
			$scope.select = function(index) {
			};
			
			$scope.load = function() {
				business.getFollowedBusiness().then(
				   function successCallback(response) {
					   $scope.results = response.data.businesses;
		           },
		           function errorCallback(response) {
			    	  alert('KO');
		           });
			};
			$scope.load();
			
			$scope.unfollow = function(uuid) {
				business.unfollowBusiness(uuid).then(
				    function successCallback(response) {
				    	$scope.load();
		            },
		            function errorCallback(response) {
		            	alert('KO');
		            });
			};
			
			$scope.configure = function(uuid, tostate) {
				$state.go(tostate, {uuid:uuid});
			};

	    },
		link: function(scope, element, attributes){
			// EVENTS BINDING
			//element.find('#search').bind('change', scope.change);
		}
	};
});

//ADD 'appOwnedBusiness' directive
//................................
angular.module('business.directives').directive('appOwnedBusiness', function(business) {
	return {
		replace: false,
		scope: {},
		templateUrl : 'templates/business/business/owned-business.html',
		controller: function($scope, $state, $window, $element, haBackend){
	       	// scope-properties
			$scope.results = [];
        	$scope.urlBackend = haBackend.getBackend();
        	$scope.rand = ''+ Math.random();
			
	       	// scope-functions
			$scope.load = function() {
				business.getOwnedBusiness().then(
				   function successCallback(response) {
					   $scope.results = response.data.businesses;
		           },
		           function errorCallback(response) {
			    	  alert('KO');
		           });
			};
			$scope.load();
			
			$scope.edit = function(uuid, tostate) {
				$state.go(tostate, {uuid:uuid});
			};
			
			$scope.remove = function(uuid, $event) {
				business.deleteBusiness(uuid).
					then(function(){$($event.currentTarget).parent().remove();});
			};
	    },
		link: function(scope, element, attributes){
			// EVENTS BINDING
			//element.find('#search').bind('change', scope.change);
		}
	};
});

//ADD 'appBusinessForm' directive
//...............................
angular.module('business.directives').directive('appBusinessForm', function(business) {
	return {
		replace: false,
		scope: true,
		templateUrl : 'js/business/templates/create-business-form.html',
		controller: function($scope, $state, $rootScope, $window, $element, $timeout, Upload){
	       	// scope-properties
			$scope.categoriesSelected = [];

	       	// scope-functions
			$scope.uploadForm = function () {
				$scope.formUpload = true;
				$scope.uploadUsingUpload($scope.logoFile);
			};
			
			$scope.uploadUsingUpload = function(file, resumable) {
				var baseUrl = $rootScope.urlBackend+'/businesses/1.0/businesses/';
				
				// Set form data
				var data = (JSON.parse(JSON.stringify($scope.uploadingBusiness)));
				
				// Set categories
				var selected = [];
				for(var i = 0; i < $scope.categoriesSelected.length; i++){
					selected.push($scope.categoriesSelected[i].uuid);
				}
				data.categories = selected;
				
				// Set file
				if(file!=null)
					data.logo = file;
						
				// Send data and get promise
				var promise = Upload.upload({
					url: baseUrl + $scope.getReqParams(),
					resumeSizeUrl: resumable ? baseUrl +'?name=' + encodeURIComponent(file.name) : null,
					resumeChunkSize: resumable ? $scope.chunkSize : null,
				    method: 'PUT',
				    data: data
				});
				
				if(file!=null) {
					file.upload = promise;

					// Set promise actions
					file.upload.then(
						function (response) {
							$timeout(function () {
								file.result = response.data;
								$state.go('app.businessmanager');
							});
						}, 
						function (response) {
							if (response.status > 0)
						        $scope.errorMsg = response.status + ': ' + response.data;
						},
					    function (evt) {
					      // Math.min is to fix IE which reports 200% sometimes
					      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
					    });
	
					file.upload.xhr(function (xhr) {
				      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
				    });
				}
				else {
					promise.then(
						function (response) {
							$timeout(function () {
								$scope.result = response.data;
								$state.go('app.businessmanager');
							});
						}
					);
				}
			};	
			  
			$scope.getReqParams = function () {
			    return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
			    '&errorMessage=' + $scope.serverErrorMsg : '';
			};
	    },
		link: function(scope, element, attributes){
			// EVENTS BINDING
			element.find('#button-send').bind('click', scope.uploadForm);
		}
	};
});

//ADD 'appOwnedBusinessForm' directive
//....................................
angular.module('business.directives').directive('appOwnedBusinessForm', function() {
	return {
		replace: false,
		scope: {
			uuid: '@uuid'
		},
		templateUrl : 'templates/business/business/owned-business-form.html',
		controller: function($scope, $state, $rootScope, $http, $window, $element, $timeout, haBackend, business, Upload){
	       	// scope-properties
			$scope.updatingBusiness = undefined;
        	$scope.urlBackend = haBackend.getBackend();
        	$scope.chunkSize = 100000;
        	$scope.rand = ''+ Math.random();

	       	// scope-functions
        	$scope.uploadForm = function () {
				$scope.formUpload = true;
				$scope.uploadUsingUpload($scope.logoFile);
			};
			
			$scope.uploadUsingUpload = function(file, resumable) {
				var baseUrl = $rootScope.urlBackend+'/businesses/1.0/businesses/'+$scope.uuid;
				var data = (JSON.parse(JSON.stringify($scope.updatingBusiness)));
				if(file!=null)
					data.logo = file;
							
				var promise = Upload.upload({
					url: baseUrl + $scope.getReqParams(),
					resumeSizeUrl: resumable ? baseUrl +'?name=' + encodeURIComponent(file.name) : null,
					resumeChunkSize: resumable ? $scope.chunkSize : null,
				    data: data
				});
				
				if(file!=null) {
					file.upload = promise;
					file.upload.then(
						function (response) {
							$timeout(function () {
								file.result = response.data;
								$state.go('app.businessmanager');
							});
						}, 
						function (response) {
							if (response.status > 0)
						        $scope.errorMsg = response.status + ': ' + response.data;
						    },
					    function (evt) {
					      // Math.min is to fix IE which reports 200% sometimes
					      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
					    });

						file.upload.xhr(function (xhr) {
					      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
					    });
				}
				else {
					promise.then(
						function (response) {
							$timeout(function () {
								$scope.result = response.data;
								$state.go('app.businessmanager');
							});
						}
					);
				}
			};	
			  
			$scope.getReqParams = function () {
			    return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
			    '&errorMessage=' + $scope.serverErrorMsg : '';
			};
			
			$scope.load = function() {
				business.getBusinessByUUID($scope.uuid).then(
			    	function successCallback(response) {
			    		$scope.updatingBusiness = response.data;
			    		// Modello per adattamento campi composti:
			    		// $scope.updatingBusiness.<JSON FIELD> = JSON.stringify($scope.updatingBusiness.<JSON FIELD>);
			    	},
			    	function errorCallback(response) {
			    		alert('KO');
			    	});
			};
			$scope.load();
	    },
		link: function(scope, element, attributes){
			// EVENTS BINDING
			element.find('#send').bind('click', scope.uploadForm);
		}
	};
});

//ADD 'haBusinessForm' directive
//..............................
angular.module('business.directives').directive('appConfigureBusinessForm', function() {
	return {
		replace: false,
		scope: {
			uuid: '@uuid'
		},
		templateUrl : 'templates/business/configure-business-form.html',
		controller: function($scope, $rootScope, $http, $window, $element, business){
	       	// scope-properties
			$scope.configuringBusiness = undefined;

	       	// scope-functions
			$scope.send = function() {
				//cloning object in order to parse and send
				var pars = (JSON.parse(JSON.stringify($scope.configuringBusiness)));
				$http.post($rootScope.urlBackend+'/businesses/1.0/businesses/by_selfConfiguration/'+$scope.uuid, pars)
					.then(
				    	function successCallback(response) {
				    	},
				    	function errorCallback(response) {
				    		alert('KO');
				    	});
			};
			
			$scope.load = function() {
				// TODO
			};
			$scope.load();
	    },
		link: function(scope, element, attributes){
			// EVENTS BINDING
			element.find('#send').bind('click', scope.send);
		}
	};
});

//ADD 'appProductForm' directive
//..............................
angular.module('business.directives').directive('appProductForm', function() {
	return {
		replace: false,
		scope: {

		},
		templateUrl : 'js/business/templates/product-form.html',
		controller: function($scope, $state, $rootScope, $window, $element, $timeout, $http, Upload){
			// scope-properties
			$scope.images = [];
			$scope.categoriesSelected = [];
			$scope.validData = true;
			$scope.data = {
				price1: 0,
				price2: 0,
				price3: 0
			};

			// scope-functions
			$scope.create = function () {
				$scope.formUpload = true;
				$scope.upload()
			};

			$scope.upload = function() {
				// Set form data without files
				var data = (JSON.parse(JSON.stringify($scope.data)));

				$http.put($rootScope.urlBackend+'/businesses/1.0/product/', data).then(
					// Form data uploaded: product created
					function (response) {
						// Uploading images
						if ($scope.images && $scope.images.length) {
							for (var i = 0; i < $scope.images.length; i++) {
								Upload.upload({
									url: $rootScope.urlBackend+'/businesses/1.0/product/image/',
									method: 'PUT',
									data: {
										file: $scope.images[i]
									}
								}).then(
									// Image loaded
									function (response) {
										// TODO
									},
									// Error loading image
									function (response) {
										if (response.status > 0){
											$scope.errorMsg = response.status + ': ' + response.data;
										}
									},
									// Progress
									function (evt) {
										$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
									}
								);
							}
						}
					},
					// Error uploading form data
					function (response) {
						alert('Error uploading form data');
						if (response.status > 0)
							$scope.errorMsg = response.status + ': ' + response.data;
					}
				);
			};
		},
		link: function(scope, element, attributes){
			// EVENTS BINDING
			element.find('#button-send').bind('click', scope.uploadForm);
		}
	};
});

//ADD 'appProductList' directive
//..............................
angular.module('business.directives').directive('appProductList', function() {
	return {
		replace: false,
		scope: true,
		templateUrl : 'templates/business/products/list.html',
		controller: function($scope, $state, $rootScope, $window, $element, $timeout){
			$scope.list = [];

			$scope.list.push({code:'2346534656235', description:'descrizione del prodotto n. 1', category:'categoria n.1'});
			$scope.list.push({code:'8658994756866', description:'descrizione del prodotto n. 2', category:'categoria n.2'});
			$scope.list.push({code:'7346236437562', description:'descrizione del prodotto n. 3', category:'categoria n.3'});
		},
		link: function(scope, element, attributes){

		}
	};
});

