/* global angular, document, window */
'use strict';

angular.module('starter.news.controllers', ['ionic'])

.controller('NewsPageCtrl', 
        function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, broker, ionicMaterialInk, ionicMaterialMotion) {
    $ionicSideMenuDelegate.canDragContent(true);
	
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialMotion.fadeSlideInRight();
    ionicMaterialInk.displayEffect();
})

;
