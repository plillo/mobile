angular.module('business.services',[]);

// **********************
// ADD 'business' service
// ======================

angular.module('business.services').factory('business', function($http, $rootScope) {
	return {
		createBusiness: function(data){
			return $http.put($rootScope.urlBackend+'/businesses/1.0/businesses/', data); // return promise
		},
		updateBusiness: function(uuid, data){
			return $http.post($rootScope.urlBackend+'/businesses/1.0/businesses/'+uuid, data); // return promise
		},
		deleteBusiness: function(uuid){
			var pars = {
				      method:'DELETE',
				      url:$rootScope.urlBackend+'/businesses/1.0/businesses/'+uuid
				};
				return $http(pars); // return promise
		},
		getBusinessByUUID: function(uuid){
			var pars = {
				      method:'GET',
				      url:$rootScope.urlBackend+'/businesses/1.0/businesses/'+uuid
				};
				return $http(pars); // return promise
		},
		getBusinessByCategory: function(category){
			var pars = {
			      method:'GET',
			      url: $rootScope.urlBackend+'/businesses/1.0/businesses/by_category/'+category
			};
			return $http(pars); // return promise
		},
		getBusinesses: function(keyword){
			var pars = {
			      method:'GET',
			      url:$rootScope.urlBackend+'/businesses/1.0/businesses/by_searchKeyword/'+keyword
			};
			return $http(pars); // return promise
		},
		getFollowedBusiness: function(search){
			var pars = {
			      method:'GET',
			      url:$rootScope.urlBackend+'/businesses/1.0/businesses/by_selfFollowed'
			};
			return $http(pars); // return promise
		},
		getNotFollowedBusiness: function(keyword){
			var pars = {
			      method:'GET',
			      url:$rootScope.urlBackend+'/businesses/1.0/businesses/by_notSelfFollowed/by_searchKeyword/'+keyword
			};
			return $http(pars); // return promise
		},
		getOwnedBusiness: function(search){
			var pars = {
			      method:'GET',
			      url:$rootScope.urlBackend+'/businesses/1.0/businesses/by_selfOwned'
			};
			return $http(pars); // return promise
		},
		followBusiness: function(uuid){
			var pars = {
			      method:'POST',
			      url:$rootScope.urlBackend+'/businesses/1.0/businesses/'+uuid+'/selfFollow'
			};
			return $http(pars); // return promise
		},
		unfollowBusiness: function(uuid){
			var pars = {
			      method:'POST',
			      url:$rootScope.urlBackend+'/businesses/1.0/businesses/'+uuid+'/selfUnfollow'
			};
			return $http(pars); // return promise
		},
		mapBusiness: function(uuid, position){
			return $http.post($rootScope.urlBackend+'/businesses/1.0/businesses/'+uuid+'/map', position); // return promise
		},
		getCategoriesBySearchKeyword: function(keyword){
			var pars = {
			      method:'GET',
			      url: $rootScope.urlBackend+'/businesses/1.0/categories/by_searchKeyword/'+keyword
			};
			return $http(pars); // return promise
		},
		getBusinessPosition: function(uuid){
			var pars = {
			      method:'GET',
			      url: $rootScope.urlBackend+'/businesses/1.0/businesses/'+uuid+'/position'
			};
			return $http(pars); // return promise
		},
		getOwnedBusinessesPositions: function(){
			var pars = {
			      method:'GET',
			      url: $rootScope.urlBackend+'/businesses/1.0/businesses/by_selfOwned/positions'
			};
			return $http(pars); // return promise
		},
		getFollowedBusinessesPositions: function(){
			var pars = {
			      method:'GET',
			      url: $rootScope.urlBackend+'/businesses/1.0/businesses/by_selfFollowed/positions'
			};
			return $http(pars); // return promise
		},
		getBusinessSubscriptionRules: function(uuid){
			var pars = {
				method:'GET',
				url: $rootScope.urlBackend+'/businesses/1.0/businesses/'+uuid+'/rules'
			};
			return $http(pars); // return promise
		}
	}
});

angular.module('business.services').factory('category', function($http, $rootScope, $q, $timeout) {
	return {
		createCategory: function(data){
			return $http.put($rootScope.urlBackend+'/businesses/1.0/category/', data); // return promise
		},
		updateCategory: function(uuid, data){
			return $http.post($rootScope.urlBackend+'/businesses/1.0/category/'+uuid, data); // return promise
		},
		deleteCategory: function(uuid){
			var pars = {
				method:'DELETE',
				url:$rootScope.urlBackend+'/businesses/1.0/category/'+uuid
			};
			return $http(pars); // return promise
		},
		getByUUID: function(uuid){
			var pars = {
				method:'GET',
				url:$rootScope.urlBackend+'/businesses/1.0/category/'+uuid
			};
			return $http(pars); // return promise
		},
		getBySearchKeyword: function(keyword){
			if(!keyword || keyword=='')
				keyword = '%20'; // space url code
			var pars = {
				method:'GET',
				url: $rootScope.urlBackend+'/businesses/1.0/category/by_searchKeyword/'+keyword
			};
			return $http(pars); // return promise

			/*
			// MOCKED IMPLEMENTATION
			var list = [];
			list.push({uuid:'11111111-af45-bca2-cfa3-a1324bc324f1', code:'mocked category 1', description:'mocked long category 1'});
			list.push({uuid:'22222222-af45-bca2-cfa3-a1324bc324f1', code:'mocked category 2', description:'mocked long category 2'});
			list.push({uuid:'33333333-af45-bca2-cfa3-a1324bc324f1', code:'mocked category 3', description:'mocked long category 3'});
			var deferred = $q.defer();
			$timeout(function() {
				deferred.resolve(list);
			}, 100);

			return deferred.promise; // return promise
			*/
		}
	}
});

angular.module('business.services').factory('product', function($http, $rootScope, $q, $timeout) {
	return {
		createProduct: function(data){
			return $http.put($rootScope.urlBackend+'/businesses/1.0/product/', data); // return promise
		},
		updateProduct: function(uuid, data){
			return $http.post($rootScope.urlBackend+'/businesses/1.0/product/'+uuid, data); // return promise
		},
		deleteProduct: function(uuid){
			var pars = {
				method:'DELETE',
				url:$rootScope.urlBackend+'/businesses/1.0/product/'+uuid
			};
			return $http(pars); // return promise
		},
		getByUUID: function(uuid){
			var pars = {
				method:'GET',
				url:$rootScope.urlBackend+'/businesses/1.0/product/'+uuid
			};
			return $http(pars); // return promise
		},
		getBySearchKeyword: function(keyword, businessUuid){
			if(!keyword || keyword=='')
				keyword = '%20'; // space url code
			var pars = {
				method:'GET',
				url: $rootScope.urlBackend+'/businesses/1.0/business/'+businessUuid+'/product/by_searchKeyword/'+keyword
			};
			return $http(pars); // return promise
		},
		getCategories: function(uuid){
			var pars = {
				method:'GET',
				url:$rootScope.urlBackend+'/businesses/1.0/product/'+uuid+'/categories'
			};
			return $http(pars); // return promise
		},
		getPictures: function(uuid){
			var pars = {
				method:'GET',
				url:$rootScope.urlBackend+'/businesses/1.0/product/'+uuid+'/pictures'
			};
			return $http(pars); // return promise
		}
	}
});

angular.module('business.services').factory('promotion', function($http, $rootScope) {
	return {
		createPromotion: function(business_uuid, data){
			return $http.put($rootScope.urlBackend+'/businesses/1.0/business/'+business_uuid+'/promotion', data); // return promise
		},
		updatePromotion: function(uuid, data){
			// businesses/1.0/promotion/{uuid}/setActivate
			return $http.post($rootScope.urlBackend+'/businesses/1.0/promotion/'+uuid, data); // return promise
		},
		activatePromotion: function(uuid){
			// businesses/1.0/promotion/{uuid}/setActive
			return $http.post($rootScope.urlBackend+'/businesses/1.0/promotion/'+uuid+'/setActive', {}); // return promise
		},
		deactivatePromotion: function(uuid){
			// businesses/1.0/promotion/{uuid}/unsetActive
			return $http.post($rootScope.urlBackend+'/businesses/1.0/promotion/'+uuid+'/unsetActive', {}); // return promise
		},
		getBySearchKeyword: function(keyword, businessUuid){
			if(!keyword || keyword=='')
				keyword = '%20'; // space url code
			var pars = {
				method:'GET',
				url: $rootScope.urlBackend+'/businesses/1.0/business/'+businessUuid+'/promotion/by_searchKeyword/'+keyword
			};
			return $http(pars); // return promise
		},
		deletePromotion: function(uuid){
			return $http.delete($rootScope.urlBackend+'/businesses/1.0/promotions/'+uuid); // return promise
		},
		deletePromotionsList: function(uuids){
			return $http.delete($rootScope.urlBackend+'/businesses/1.0/promotions',{params:{listUuid:uuids}}); // return promise
		},
		getByUUID: function(uuid){
			var pars = {
				method:'GET',
				url:$rootScope.urlBackend+'/businesses/1.0/promotion/'+uuid
			};
			return $http(pars); // return promise
		}
	}
});