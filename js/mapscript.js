var nameApp = angular.module('starter', ['ionic', 'uiGmapgoogle-maps']);

nameApp.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/map.html',
      controller: 'MapCtrl'
    });
  $urlRouterProvider.otherwise("/");
 
});

nameApp.controller('MapCtrl', function($scope) {
  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
});