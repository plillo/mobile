'use strict';
angular.module('games.develop.directives', ['ngFileUpload']);

//ADD 'gameTris' directive
//........................
angular.module('games.develop.directives').directive('gameTris', function() {
    return {
        replace: true,
        scope: {

        },
        templateUrl : 'js/games/develop/tris/templates/gametris.html',
        controller: function($scope, $window, $element){
          $scope.matTris = [[0,0,0],
                            [0,0,0],
                            [0,0,0]];

          $scope.player = 1;

          $scope.timer1 = 0.0;
          $scope.timer2 = 0.0;

          $scope.getNumber = function(num){
            return new Array(num);
          }

          $scope.Play = function(){

          };

          $scope.setPlay = function(x, y){
            //if the the matrix is free on the point
            if(matTris[x][y] == 0){
              matTris[x][y] = player;
            }
            else //the player can't play here
             alert('you cannnot play this move!');
          };


        },
        link: function(scope, element, attributes){

        }
    };
});
