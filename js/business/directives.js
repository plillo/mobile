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
		templateUrl : 'js/business/templates/search-business.html',
		controller: function($scope, $state, $window, $element, haBackend){
	       	// scope-properties
			$scope.results = [];
        	$scope.urlBackend = haBackend.getBackend();
			$scope.rand = ''+ Math.random();
			
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
angular.module('business.directives').directive('appSubscriptionsList', function(business) {
	return {
		replace: false,
		scope: {},
		templateUrl : 'js/business/templates/subscriptions-list.html',
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
			
			$scope.go = function(uuid, tostate) {
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
angular.module('business.directives').directive('appOwnedBusinessesList', function(business) {
	return {
		replace: false,
		scope: {},
		templateUrl : 'js/business/templates/owned-businesses-list.html',
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
				//data.categories = selected;
				data.categories = selected.join(",");
				
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

//ADD 'appConfigureBusinessForm' directive
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

//TODO
//ADD 'appSubscriptionRules' directive
//..............................
angular.module('business.directives').directive('appSubscriptionRules', function() {
	return {
		replace: false,
		scope: {
			uuid: '@uuid'
		},
		templateUrl : 'js/business/templates/subscription-rules.html',
		controller: function($scope, $rootScope, $http, $window, $element, business){
			$scope.subscriptionRules = {};

			$scope.load = function() {
				business.getBusinessSubscriptionRules($scope.uuid).then(
					function successCallback(response) {
						if(!response.data.matched)
							return;

						// Set business name
						$scope.businessName = response.data.name;

						var setter = function(rule){
							if(response.data.rules[rule]==undefined)
								response.data.rules[rule] = true;
						};
						setter('active');
						setter('mailChannel');
						setter('smsChannel');
						setter('pushChannel');
						setter('volantinoChannel');
						setter('SPOPromo');
						setter('DSCPromo');
						setter('NXMPromo');
						setter('LMTPromo');
						setter('GRAPromo');
						setter('CPNPromo');
						setter('news');
						setter('chat');

						// Set rules
						$scope.subscriptionRules = response.data.rules;
					},
					function errorCallback(response) {
						alert('KO');
					});
			};
			$scope.load();

			$scope.toggleRule = function(rule) {
				// Rule validation
				switch(rule){
					// general activation
					case 'active':
					// channels
					case 'mailChannel':
					case 'smsChannel':
					case 'pushChannel':
					case 'volantinoChannel':
					// promotions
					case 'SPOPromo':
					case 'DSCPromo':
					case 'NXMPromo':
					case 'LMTPromo':
					case 'GRAPromo':
					case 'CPNPromo':
					// retailer services
					case 'news':
					case 'chat':break;
					default: return; // not a valid rule
				}

				// toggle value
				var set = !$scope.subscriptionRules[rule];

				// Backend command
				business.setBusinessSubscriptionRule($scope.uuid, rule, set).then(
					function successCallback(response) {
						$scope.subscriptionRules[rule] = response.data.status;
					},
					function errorCallback(response) {
						response.data.message;
					}
				);
			};
		},
		link: function(scope, element, attributes){

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
			var business = $state.params.uuid;
			
			// scope-properties
			// ================
			$scope.images = [];
			$scope.categoriesSelected = [];
			$scope.validData = true;
			// default form data
			$scope.data = {};
			$scope.data.prices = [0,0,0];
			$scope.loading = false;
			$scope.allLoaded = false;

			$scope.refresh = function(){
				$scope.allLoaded = $scope.images.reduce(function(total, elem){return total&&elem.haLoaded},true);
			};

			// scope-functions
			// ===============
			$scope.$watch('images', function(newValue, oldValue) {
				if(newValue.length > oldValue.length) {
					newValue[newValue.length-1].haLoaded = false;
					newValue[newValue.length-1].haLoadMessage = 'loading...';
				}
			});

			$scope.create = function () {
				$scope.formUpload = true;
				$scope.upload()
			};

			$scope.launchRequest = function(i, puuid) {
				Upload.upload({
					url: $rootScope.urlBackend+'/businesses/1.0/product/'+puuid+'/picture/',
					method: 'PUT',
					data: {
						picture: $scope.images[i]
					}
				}).then(
					// Image loaded
					function (response) {
						$scope.images[i].haLoaded = 'true';
						$scope.images[i].haLoadMessage = 'loaded';
						$scope.refresh();
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
			};

			$scope.upload = function() {
				// Set categories
				if($scope.categoriesSelected.length>0) {
					$scope.data.categories = [];
					for (var i = 0; i < $scope.categoriesSelected.length; i++) {
						$scope.data.categories.push($scope.categoriesSelected[i].uuid);
					}
				}

				// Set form data without files
				var data = (JSON.parse(JSON.stringify($scope.data)));

				// Set loading flag
				$scope.loading = true;

				$http.put($rootScope.urlBackend+'/businesses/1.0/business/'+business+'/product', data).then(
					// Form data uploaded: product created
					function (response) {
						// Get new product uuid
						var puuid = response.data.product.uuid;
						// Uploading images
						if ($scope.images && $scope.images.length) {
							for (var i = 0; i < $scope.images.length; i++) {
								$scope.launchRequest(i, puuid);
							}
						}
						//$state.go('app.businessmanager.business.productsmanager.list');
					},
					// Error uploading form data
					function (response) {
						alert('Error uploading form data');
						if (response.status > 0)
							$scope.errorMsg = response.status + ': ' + response.data;
					}
				);
			};

			$scope.go = function(state){
				$state.go(state);
			};
			
			$scope.reload = function(){
				$window.location.reload();
			};
			
		},
		link: function(scope, element, attributes){
		}
	};
});

//ADD 'appEditProduct' directive
//..............................
angular.module('business.directives').directive('appEditProduct', function() {
	return {
		replace: false,
		templateUrl : 'js/business/templates/product-edit.html',
		controller: function($scope, $state, $rootScope, $window, $element, $timeout, $http, Upload){
			var business = $state.params.uuid;

			// scope-properties
			// ================
			$scope.categoriesSelected = $scope.actualProductCategories ? $scope.actualProductCategories:[];
			$scope.validData = true;

			var item = $scope.list[$scope.actualIndex];

			// default form data
			$scope.data = {};
			$scope.data.uuid = item.uuid;
			$scope.data.code = item.code;
			$scope.data.barcode = item.barcode;
			$scope.data._locDescription = item._locDescription;
			$scope.data._locLongDescription = item._locLongDescription;
			$scope.data.prices = item.prices;

			// scope-functions
			// ===============
			$scope.upload = function() {
				// Set categories
				if($scope.categoriesSelected.length>0) {
					$scope.data.categories = [];
					for (var i = 0; i < $scope.categoriesSelected.length; i++) {
						$scope.data.categories.push($scope.categoriesSelected[i].uuid);
					}
				}

				// Set form data without files
				var data = (JSON.parse(JSON.stringify($scope.data)));

				// Set loading flag
				$scope.loading = true;

				$http.post($rootScope.urlBackend+'/businesses/1.0/product', data).then(
					// Form data uploaded: product updated
					function (response) {
						$scope.loading = false;
						$scope.list[$scope.actualIndex] = response.data.product;
						$scope.popupClose();
					},
					// Error uploading form data
					function (response) {
						$scope.loading = false;
						if (response.status > 0)
							$scope.errorMsg = response.status + ': ' + response.data;
					}
				);
			};
		},
		link: function(scope, element, attributes){
		}
	};
});

//ADD 'appProductList' directive
//..............................
angular.module('business.directives').directive('appProductList', function() {
	return {
		replace: false,
		scope: true,
		templateUrl : 'js/business/templates/product-list.html',
		controller: function($scope, $state, $rootScope, $window, $element, $ionicPopup, $timeout, product){
			$scope.list = [];
			var business = $state.params.uuid;

			product.getBySearchKeyword('', business).then(
				// products list received
				function (response) {
					$scope.list = response.data;
				},
				// error
				function(response){
					$scope.list = [];
				}
			);

			$scope.Math = $window.Math;

			$scope.getNumber = function(number) {
				return new Array(number);
			};

			// in order to setting $scope.actualProduct from child scopes
			$scope.setActualProduct = function(value) {
				$scope.actualProduct = value;
			};

			$scope.edit = function(index) {
				$scope.data = {};
				$scope.actualIndex = index;
				$scope.actualProductCategories = [];
				
				// GET categories
				product.getCategories($scope.list[index].uuid)
				.then(
					function (response) {
						$scope.actualProductCategories = response.data;
					},
					function (response) {
						$scope.actualProductCategories = [];
					}
				)
				.finally(  // Wait for $scope.actualProductCategories initialization
					function(){
						$scope.popup = $ionicPopup.show({
							template: '<app-edit-product></app-edit-product>',
							cssClass: 'ha-popup',
							title: 'Modifica prodotto/servizio',
							scope: $scope
						});

						$scope.popup.then(function(res) {
							console.log('Tapped!', res);
						});
					}
				);
			};

			$scope.editPictures = function(item) {
				$scope.data = {};
				$scope.actualProduct = item;
				if(!$scope.actualProduct.pictures)
					$scope.actualProduct.pictures = [];

				// An elaborate, custom popup
				$scope.popup = $ionicPopup.show({
					template: '<app-product-pictures></app-product-pictures>',
					cssClass: 'ha-popup',
					title: 'Modifica delle immagini',
					scope: $scope
				});

				$scope.popup.then(function(res) {
					console.log('Tapped!', res);
				});
			};

			$scope.popupClose = function() {
				$scope.popup.close();
			};
		},
		link: function(scope, element, attributes){
		}
	};
});

//ADD 'appProductPictures' directive
//..................................
angular.module('business.directives').directive('appProductPictures', function() {
	return {
		replace: false,
		templateUrl : 'js/business/templates/product-pictures.html',
		controller: function($scope, $state, $rootScope, $window, $element, $timeout, $http, product, Upload){

			$scope.reset = function(){
				$scope.images = [];
				$scope.imageRows = [];
				$scope.validData = true;
				$scope.loading = false;
				$scope.loaded = false;

				for(var k=0;k<Math.ceil(($scope.actualProduct.pictures.length)/3);k++)
					$scope.imageRows.push(k);
			};

			$scope.refresh = function(){
				$scope.loaded = $scope.images.reduce(function(total, elem){return total&&elem.haLoaded},true);
			};

			// scope-functions
			// ===============
			$scope.$watch('images', function(newValue, oldValue) {
				if(newValue.length > oldValue.length) {
					newValue[newValue.length-1].haLoaded = false;
					newValue[newValue.length-1].haLoadMessage = 'loading...';
				}
			});

			$scope.$watch('loaded', function(newValue, oldValue) {
				if(newValue) {
					product.getPictures($scope.actualProduct.uuid).then(
						function(response){
							$scope.actualProduct.pictures = response.data.pictures;
							$scope.reset();
						},
						function(response){
							if (response.status > 0){
								$scope.errorMsg = response.status + ': ' + response.data;
							}
						}
					);
				}
			});

			$scope.launchRequest = function(index) {
				Upload.upload({
					url: $rootScope.urlBackend+'/businesses/1.0/product/'+$scope.actualProduct.uuid+'/picture/',
					method: 'PUT',
					data: {
						picture: $scope.images[index]
					}
				}).then(
					// Image loaded
					function (response) {
						$scope.images[index].haLoaded = 'true';
						$scope.images[index].haLoadMessage = 'loaded';
						$scope.refresh();
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
			};

			$scope.upload = function() {
				// Set loading flag
				$scope.loading = true;

				// Upload images
				if ($scope.images && $scope.images.length) {
					for (var i = 0; i < $scope.images.length; i++) {
						$scope.launchRequest(i);
					}
				}
			};

			// INITIALIZATION/RESET
			$scope.reset();
		},
		link: function(scope, element, attributes){
		}
	};
});

//ADD 'appPromotionList' directive
//..............................
angular.module('business.directives').directive('appPromotionList', function() {
	return {
		replace: false,
		scope: true,
		templateUrl : 'js/business/templates/promotion-list.html',
		controller: function($scope, $state, $rootScope, $window, $element, $ionicPopup, $timeout, promotion){
			$scope.list = [];
			var business = $state.params.uuid;

			promotion.getBySearchKeyword('', business).then(
				// products list received
				function (response) {
					$scope.list = response.data;
				},
				// error
				function(response){
					$scope.list = [];
				}
			);

			$scope.Math = $window.Math;

			$scope.getNumber = function(number) {
				return new Array(number);
			};

			// in order to setting $scope.actualProduct from child scopes
			$scope.setActualPromotion = function(value) {
				$scope.actualPromotion= value;
			};

			$scope.actived = function(index) {
				var row = $scope.list[index];
				row.active = !row.active;

				var setUnset = row.active?promotion.activatePromotion:promotion.deactivatePromotion;
				setUnset(row.uuid).then(
					// success
					function (response) {
					},
					// error
					function(response){
						var data = response.data;
						alert(data.status+':'+data.message);
					}
				);

			};

			$scope.delete = function(index) {
				// promotion.deletePromotion($scope.list[index].uuid).then(
				promotion.deletePromotionsList([$scope.list[index].uuid]).then(
					// success
					function (response) {
						$scope.list.splice(index,1);
					},
					// error
					function(response){

					}
				);

			};

			$scope.edit = function(index) {
				$scope.data = {};
				$scope.actualIndex = index;

				//TODO
			};

			$scope.popupClose = function() {
				$scope.popup.close();
			};
		},
		link: function(scope, element, attributes){
		}
	};
});