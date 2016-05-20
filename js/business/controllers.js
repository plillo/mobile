'use strict';

angular.module('business.controllers', ['ionic', 'uiGmapgoogle-maps'])

.controller('BusinessMainCtrl', function($scope, $stateParams, $timeout, $ionicSideMenuDelegate, ionicMaterialInk) {
    $ionicSideMenuDelegate.canDragContent(true);

    $scope.uuid = $stateParams.uuid;

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('BusinessManagerCtrl', function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion) {
    $ionicSideMenuDelegate.canDragContent(true);

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('CreateBusinessCtrl', function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion) {
    $ionicSideMenuDelegate.canDragContent(true);

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.results = [];
    $scope.categoriesSelected = [];

    $scope.searchCategories = function($event){
        alert(event.target.html());
    }

    $scope.selectCategory = function(k){
        alert(JSON.stringify($scope.results));
    }
})

.controller('ConfigureBusinessCtrl', function($scope, $stateParams, $timeout, $ionicSideMenuDelegate, ionicMaterialInk) {
    $ionicSideMenuDelegate.canDragContent(true);

    $scope.uuid = $stateParams.uuid;

    /*
     // Set Header
     $scope.$parent.showHeader();
     $scope.$parent.clearFabs();
     $scope.$parent.setHeaderFab('left');

     // Delay expansion
     $timeout(function() {
     $scope.isExpanded = true;
     $scope.$parent.setExpanded(true);
     }, 300);

     // Set Ink
     ionicMaterialInk.displayEffect();
     */
})

.controller('MapBusinessCtrl', function($scope, $timeout, $stateParams, business, $ionicSideMenuDelegate, uiGmapIsReady, ionicMaterialInk, ionicMaterialMotion) {
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.uuid = $stateParams.uuid;

    $scope.map = {
        center: { latitude: 40, longitude: 18 },
        zoom: 10,
        control : {}
    };

    uiGmapIsReady.promise().then(function (maps) {
        business.getBusinessPosition($scope.uuid).then(
            function successCallback(response) {
                $scope.position = response.data;

                if($scope.position==""){
                    $scope.position = {};
                    $scope.position.lat = $scope.map.center.latitude;
                    $scope.position.lng = $scope.map.center.longitude;
                }
                else
                    $scope.map.center = { latitude: $scope.position.lat, longitude: $scope.position.lng };

                var map = $scope.map.control.getGMap();

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng($scope.position.lat,$scope.position.lng),
                    title: "Business position",
                    draggable: true
                });
                marker.setMap(map);
                marker.addListener('dragend', function(evt) {
                    $scope.position = marker.getPosition();

                    // set zoom
                    if(map.getZoom()<13) map.setZoom(13);

                    // set center
                    map.setCenter($scope.position);

                    // set back-end position
                    business.mapBusiness($scope.uuid, $scope.position.toJSON());
                });
            },
            function errorCallback(response) {
                var map = $scope.map.control.getGMap();

                var marker = new google.maps.Marker({
                    position: map.getCenter(),
                    title:"Business position",
                    draggable: true
                });
                marker.setMap(map);
                marker.addListener('dragend', function(evt) {
                    $scope.position = marker.getPosition();

                    // set zoom
                    if(map.getZoom()<13) map.setZoom(13);

                    // set center
                    map.setCenter($scope.position);

                    // set back-end position
                    business.mapBusiness($scope.uuid, $scope.position.toJSON());
                });
            });
    });
})

.controller('MapBusinessesCtrl', function($scope, $timeout, business, uiGmapIsReady, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion) {
    $ionicSideMenuDelegate.canDragContent(false);

    $scope.map = {
        center: { latitude: 40, longitude: 18 },
        zoom: 8,
        control : {}
    };

    uiGmapIsReady.promise().then(function (maps) {
        business.getOwnedBusinessesPositions().then(
            function successCallback(response) {
                // attach handlers function
                function attachHandlers(map, marker, position) {
                    // add click listener
                    marker.addListener('click', function() {
                        var infowindow = new google.maps.InfoWindow({
                            content: position.description
                        });
                        infowindow.open(map, marker);
                    });

                    // add dragend listener
                    marker.addListener('dragend', function() {
                        var new_position = marker.getPosition();

                        // set back-end position
                        business.mapBusiness(position.uuid, new_position.toJSON());
                    });
                };

                var positions = response.data;

                // Center MAP
                var center_lng = 0, center_lat = 0;
                for(var k=0;k<positions.length;k++){
                    center_lng += positions[k].coordinates.lng;
                    center_lat += positions[k].coordinates.lat;
                }
                if(positions.length>0){
                    center_lng = center_lng/positions.length;
                    center_lat = center_lat/positions.length;
                }
                $scope.map.center = {latitude: center_lat, longitude: center_lng };

                // get MAP
                var map = $scope.map.control.getGMap();

                // set markers
                for(var k=0;k<positions.length;k++){
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(positions[k].coordinates.lat,positions[k].coordinates.lng),
                        title: positions[k].uuid,
                        draggable: true
                    });
                    marker.setMap(map);

                    // attach handlers
                    attachHandlers(map, marker, positions[k]);
                }
            },
            function errorCallback(response) {
                alert(JSON.stringify(response));
            });
    });
})

.controller('ProductsMainCtrl', function($scope, $timeout, $ionicSideMenuDelegate, ionicMaterialInk) {
    $ionicSideMenuDelegate.canDragContent(true);

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ServicesMainCtrl', function($scope, $timeout, $ionicSideMenuDelegate, ionicMaterialInk) {
    $ionicSideMenuDelegate.canDragContent(true);

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('PromotionsCtrl', function($scope) {
    $scope.click = function($event){
        $($event.target).closest('.ha-tab-image').find('.ha-tab-image-selected').removeClass('ha-tab-image-selected');
        $($event.target).removeClass('ha-tab-image-not-selected').addClass('ha-tab-image-selected').closest('.ha-tab-image').find('img:not(.ha-tab-image-selected)').addClass('ha-tab-image-not-selected');
    }
})

.controller('PromotionsSpecialOfferCtrl', function($scope) {
    $scope.fromDatetimeValue = new Date();
    $scope.toDatetimeValue = new Date();
    $scope.promotion = {};
    $scope.promotion.quantity = 1;
    $scope.promotion.price = 0;
})

;


