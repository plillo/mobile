/* global angular, document, window */
'use strict';

angular.module('news.controllers', ['ionic'])

.controller('NewsPageCtrl', 
        function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, broker, ionicMaterialInk, ionicMaterialMotion) {
    $ionicSideMenuDelegate.canDragContent(true);
})

.controller('NewsCtrl',
    function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, broker, ionicMaterialInk, ionicMaterialMotion) {
        $ionicSideMenuDelegate.canDragContent(true);
    })

;
