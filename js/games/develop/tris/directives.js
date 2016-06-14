'use strict';
angular.module('games.develop.directives', ['ngFileUpload']);

//ADD 'gameTris' directive
//........................
angular.module('games.develop.directives').directive('gameTris', function(business, $interval, $timeout) {
    return {
        replace: false,
        scope: {},
        templateUrl : 'js/games/develop/tris/templates/gametris.html',
        controller: function($scope, $window, $element){

          $scope.init = function(lengthMatrix){

            $scope.gameFinished = false;
            $scope.message = "";

            $scope.matTris = [];
            for (var i = 0; i < lengthMatrix; i++) {
              var row = [0,0,0];
              for (var j = 0; j < lengthMatrix; j++) {
                row.push(j+1);
              }
              $scope.matTris.push(row);
            }

            // $scope.time = Date.now();
            $scope.gameHasStarted = false;
            $scope.isPlayer1Playing = true;
            $scope.cantPlay = false;


            //ordine di connessione?
            $scope.player = 1;

            //TODO: make timer handle minutes

            $scope.totalTimePlayer1 = 0.0;
            $scope.totalTimePlayer2 = 0.0;


            $scope.timePlayer1 = new Date();
            $scope.timePlayer2 = new Date();

            $scope.timerPlayer1 = 0.0;
            $scope.timerPlayer2 = 0.0;
          };

          $scope.getCaseImg = function (x,y) {
            return "js/games/develop/tris/img/"+$scope.matTris[x][y]+".png";
          };

          $scope.getArray = function(length){
            return new Array(length);
          };

          $scope.sendStartTimer = function(player){

          };

          $scope.isMatEmpty = function(mat, length, emptyValue){
            for(var i=0; i < length; i++)
            {
              for(var j=0; j < length; j++)
              {
                if(mat[i][j] != emptyValue)
                  return false;
              }
            }

            return true;
          };

          $scope.isMatFull = function(mat, length, emptyValue){
            for(var i=0; i < length; i++)
            {
              for(var j=0; j < length; j++)
              {
                if(mat[i][j] == emptyValue)
                  return false;
              }
            }

            return true;
          };

         var timer = $interval(function() {
           if($scope.gameHasStarted && !$scope.gameFinished){
             if($scope.player == 1){
               $scope.timerPlayer1 = (new Date() - $scope.timePlayer1) + $scope.totalTimePlayer1;
             }
             else{
               $scope.timerPlayer2 = (new Date() - $scope.timePlayer2) + $scope.totalTimePlayer2;
             }
           }
          }, 10);

          $scope.startTimer = function(player){
            if(player == 1)
              $scope.sendStartTimer(1);
            else
              $scope.sendStartTimer(2);
          };

          $scope.Play = function(){
            $scope.init(3);
            $scope.startTimer(1);
            $scope.gameHasStarted = true;
          };

          $scope.gameFinish = function(){
            $scope.gameFinished = true;

            //TODO: Send a message to the broker saying that is game is over

          };

          $scope.changePlayer = function(){
            if($scope.isMatFull($scope.matTris, 3, 0)){

              if($scope.totalTimePlayer1 < $scope.totalTimePlayer2)
                $scope.message = "Player 1 wins!";
              else
                $scope.message = "Player 2 wins!";

              $scope.gameFinish();
            }
            else{
              if($scope.player == 1){
                $scope.player = 2;
                $scope.isPlayer1Playing = false;

                $scope.totalTimePlayer1 = $scope.timerPlayer1;
                $scope.timePlayer2 = new Date();
              }
              else{
                $scope.player = 1;
                $scope.isPlayer1Playing = true;

                $scope.totalTimePlayer2 = $scope.timerPlayer2;
                $scope.timePlayer1 = new Date();
              }
              $scope.sendStartTimer($scope.player);
            }
          };

          $scope.setPlay = function(x, y){
            if($scope.gameHasStarted){
                //if the the matrix is free on the point
                if($scope.matTris[x][y] == 0){
                  $scope.matTris[x][y] = $scope.player;
                  $scope.changePlayer();
                  $scope.cantPlay = false;
                }
                else //the player can't play here
                  $scope.$broadcast('cantPlay');
            }
            else
              $scope.$broadcast("gameNotStarted");
          };

          $scope.win = function(){

          };

          $scope.lose = function(){

          };

          $scope.$on('$destroy', function() {
            //$interval.cancel(timer);
          });

          $scope.$on('cantPlay', function () {
            $scope.cantPlay = true;

            $timeout(function () {
              $scope.cantPlay = false;
            }, 1200);
          });

          $scope.$on('gameNotStarted', function () {

            $scope.warnGameNotStarted = true;

            $timeout(function () {
              $scope.warnGameNotStarted = false;
            }, 1200);
          });
        },
        link: function(scope, element, attributes){
            scope.init(3);
        }
    };
});
