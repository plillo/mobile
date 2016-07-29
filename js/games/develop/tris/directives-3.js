'use strict';
angular.module('games.develop.directives', ['ngFileUpload']);

//ADD 'gameTris' directive
//........................
angular.module('games.develop.directives').directive('gameTris', function(haApplication, haBroker, haBackend, $http, $interval, $timeout, $ionicLoading) {
    return {
        replace: false,
        scope: {},
        templateUrl : 'js/games/develop/tris/templates/gametris-3.html',
        controller: function($scope, $window, $element){

            $scope.trisState = 0;

            //add the clientID?
            $scope.playersList = [{
              'name' : 'test'
            }, {
              'name' : 'test1'
            }];

            $scope.isSearchingAPlayer = false;

            // ================================================================================
            $scope.startable = false;
            $scope.clientTopic = 'games/tris/'+haBroker.clientID;
            $scope.gameSessionTopic = undefined;
            $scope.playerId = undefined;
            $scope.timer = undefined;
            $scope.playerTime = [0,0];
            $scope.winnerStatus = false;
            $scope.loserStatus = false;
            $scope.me = 0;
            $scope.notme = 1;
            // ================================================================================

            $scope.init = function(lengthMatrix){

                $scope.gameFinished = false;
                $scope.message = "";

                $scope.matTris = [];
                for (var i = 0; i < lengthMatrix; i++) {
                    var row = [];
                    for (var j = 0; j < lengthMatrix; j++) {
                    row.push(0);
                    }
                    $scope.matTris.push(row);
                }

                // $scope.time = Date.now();
                $scope.gameHasStarted = false;
                $scope.isPlayer1Playing = true;
                $scope.cantPlay = false;
            };

            $scope.getCaseImg = function (x,y) {
                return "js/games/develop/tris/img/"+$scope.matTris[x][y]+".png";
            };

            $scope.getArray = function(length){
                return new Array(length);
            };

            $scope.isMatEmpty = function(mat, length, emptyValue){
                for(var i=0; i < length; i++)
                {
                    for(var j=0; j < length; j++) {
                    if(mat[i][j] != emptyValue)
                        return false;
                    }
                }
                return true;
            };

            $scope.isMatFull = function(mat, length, emptyValue){
                for(var i=0; i < length; i++) {
                    for(var j=0; j < length; j++) {
                        if(mat[i][j] == emptyValue)
                        return false;
                    }
                }
                return true;
            };

            $scope.initTheGame = function(){
                $scope.init(3);
                $scope.gameInitiated = true;
            };

            $scope.startTheGame = function(starterPlayer){
                $scope.gameStarted = true;
                $scope.startDate = new Date();
                var startTime = $scope.playerTime[starterPlayer-1];
                $scope.timer = $interval(function() {
                    $scope.playerTime[starterPlayer-1] = startTime + (new Date() - $scope.startDate);
                }, 55);
            };

            $scope.playTheGame = function(newPlayer){
                $scope.currentPlayer = newPlayer;
                $scope.startDate = new Date();
                var startTime = $scope.playerTime[newPlayer-1];
                $scope.timer = $interval(function() {
                    $scope.playerTime[newPlayer-1] = startTime + (new Date() - $scope.startDate);
                }, 55);
            };

            $scope.finishTheGame = function(winner, tris){
                $scope.gameFinished = true;
                if($scope.playerId==winner)
                    $scope.winnerStatus = true;
                else
                    $scope.loserStatus = true;

                if(tris[0]>0 && $scope.winnerStatus) {
                    $('#'+tris[0]+'1').addClass('tris-ok');
                    $('#'+tris[0]+'2').addClass('tris-ok');
                    $('#'+tris[0]+'3').addClass('tris-ok');
                }
                if(tris[0]>0 && $scope.loserStatus) {
                    $('#'+tris[0]+'1').addClass('tris-ko');
                    $('#'+tris[0]+'2').addClass('tris-ko');
                    $('#'+tris[0]+'3').addClass('tris-ko');
                }
                if(tris[1]>0 && $scope.winnerStatus) {
                    $('#1'+tris[1]).addClass('tris-ok');
                    $('#2'+tris[1]).addClass('tris-ok');
                    $('#3'+tris[1]).addClass('tris-ok');
                }
                if(tris[1]>0 && $scope.loserStatus) {
                    $('#1'+tris[1]).addClass('tris-ko');
                    $('#2'+tris[1]).addClass('tris-ko');
                    $('#3'+tris[1]).addClass('tris-ko');
                }
                if(tris[2]==1 && $scope.winnerStatus) {
                    $('#11').addClass('tris-ok');
                    $('#22').addClass('tris-ok');
                    $('#33').addClass('tris-ok');
                }
                if(tris[2]==1 && $scope.loserStatus) {
                    $('#11').addClass('tris-ko');
                    $('#22').addClass('tris-ko');
                    $('#33').addClass('tris-ko');
                }
                if(tris[2]==2 && $scope.winnerStatus) {
                    $('#13').addClass('tris-ok');
                    $('#22').addClass('tris-ok');
                    $('#31').addClass('tris-ok');
                }
                if(tris[2]==2 && $scope.loserStatus) {
                    $('#13').addClass('tris-ko');
                    $('#22').addClass('tris-ko');
                    $('#31').addClass('tris-ko');
                }
                if(tris[2]==3 && $scope.winnerStatus) {
                    $('div.timer.me').addClass('tris-ok');
                }
                if(tris[2]==3 && $scope.loserStatus) {
                    $('div.timer.me').addClass('tris-ko');
                }
            };

            $scope.stopTimer = function() {
                if(!$interval)
                    return;

                $interval.cancel($scope.timer);
                $scope.timer = undefined;
            };

            $scope.setPosition = function(x, y){
                if($scope.gameFinished)
                    $scope.$broadcast("gameFinished"); // EVENT
                else if($scope.gameStarted){
                    //if the the matrix is free on the point
                    if($scope.matTris[x][y] == 0){
                        $scope.stopTimer();
                        $scope.matTris[x][y] = $scope.playerId;

                        // ========================================
                        $scope.sendAction({
                            gameSessionTopic:$scope.gameSessionTopic,
                            x:x,
                            y:y,
                            state:$scope.matTris,
                            timers:$scope.playerTime,
                            playerId:$scope.playerId
                        });
                        // ========================================
                    }
                    else //the player can't play here
                        $scope.$broadcast('cantPlay'); // EVENT
                }
                else
                    $scope.$broadcast("gameNotStarted"); // EVENT
            };

            // TOPICS HANDLERS
            // ================================================================================
            // getTopicMessage
            $scope.getClientTopicMessage = function(message){
                var payload = undefined;
                try {
                    var payload = JSON.parse(unescape(message));
                    // SET client command
                    $scope.clientCommand = payload.command;
                    switch($scope.clientCommand) {
                        case 'requesttoplay':
                            // TODO logic
                            // visualizza pulsanti per ACCEPT/REJECT della proposta di gioco
                            // accettazione/rifiuto vengono inoltrati al server via 'sendAction'

                          $ionicLoading.show({
                            template: '<h3>Request received</h3>' +
                            '<button ng-click="requestIWantToPlayResponse(true)">Yes</button>' +
                            '<button ng-click="requestIWantToPlayResponse(false)">No</button>',

                            scope: $scope
                          });


                            break;
                      case 'rejectedrequest':
                            // TODO logic
                            // il giocatore invitato HA RIFIUTATO L'INVITO
                            // segnalare il rifiuto

                            //TODO chiamare un overlay tipo: tizio ha rifiutato il tuo invito, ok trovare qualcun'altro

                            $ionicLoading.show({
                              template: '<h3>Request declined</h3>' +
                              '<button ng-click="hideOverlay()">ok</button>',

                              scope: $scope
                            });

                            break;
                        case 'ready':
                            // Il backend segnala l'AVVIO DI UNA SESSIONE DI GIOCO
                            $scope.startable = true;
                            $scope.gameSessionTopic = payload.gameSessionTopic;
                            $scope.opponent = payload.opponent; // nuovo: contiene lo username dell'avversario
                            $scope.playerId = payload.playerId;
                            if($scope.playerId==1) {
                                $scope.me = 0;
                                $scope.notme = 1;
                            }
                            else {
                                $scope.me = 1;
                                $scope.notme = 0;
                            }

                            // sottoscrizione del GAME SESSION TOPIC
                            haBroker.subscribe($scope.gameSessionTopic, $scope.getGameSessionTopicMessage, 2);

                            $scope.initTheGame();
                            break;
                    }
                }
                catch(error) {
                    alert(error);
                    return;
                }
            };

            // getGameSessionTopicMessage
            $scope.getGameSessionTopicMessage = function(message){
                var payload = undefined;
                try {
                    var decodedMessage = decodeURIComponent(message.replace(/\+/g,'%20'));
                    var payload = JSON.parse(decodedMessage);
                    // SET session command
                    $scope.sessionCommand = payload.command;

                    $scope.$apply(function () {
                        switch($scope.sessionCommand) {
                            case 'setup':
                                break;
                            case 'start':
                                $scope.startTheGame(payload.playerStarter);
                                break;
                            case 'finish':
                                $scope.stopTimer();
                                $scope.matTris = payload.state;
                                $scope.playerTime = payload.timers;
                                $scope.finishTheGame(payload.winner, payload.tris);
                                break;
                            case 'play':
                                $scope.stopTimer();
                                $scope.matTris = payload.state;
                                $scope.playerTime = payload.timers;
                                $scope.playTheGame(payload.nextPlayer);
                                break;
                        }
                    });
                }
                catch(error) {
                    alert(error);
                    return;
                }
            };

            // send ACTION to broker via HTTP
            $scope.sendAction = function(data){
                // PRE-SEND processing
                switch(respdata.oricommand){
                    case 'position':
                        $scope.stopTimer();
                        break;
                }

                // POST REQUEST
                $http.post(haBackend.getBackend()+'/games/1.0/tris/player/'+haBroker.clientID+'/action', data).then(
                    function successCallback(response) {
                        // POST-SEND PROCESSING
                        var respdata = response.data;
                        switch(respdata.oricommand){
                            case 'position':
                                break;
                            case 'iwanttoplay':
                                break;
                            case 'playwith':
                                break;
                            case 'accept':
                                break;
                            case 'reject':
                                break;
                        }
                    },
                    function errorCallback(response) {
                        // alert(response);
                    }
                );
            };
            // ================================================================================





            // ================================================================================

          //send request to the player: index
            $scope.sendGameRequestTo = function(index){
              console.log($scope.playersList[index].name);

              $scope.sendAction({
                clientID: $scope.playersList[index].clientID
              })

            };

            // ================================================================================



            $scope.playButton = function(){
              $scope.trisState = 1;
            };

          $scope.requestIWantToPlayResponse = function(response){
            $scope.hideOverlay();

            //TODO gestire la risposta
            if(response == true){
              //il giocatore ha accettato
            } else {

            }
          };

          $scope.hideOverlay = function(){
            $ionicLoading.hide();
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

            $scope.$on('gameFinished', function () {
                $scope.warnGameFinished = true;

                $timeout(function () {
                    $scope.warnGameFinished = false;
                }, 1200);
            });
        },
        link: function(scope, element, attributes){
            scope.init(3);

            // ================================================================================
            haBroker.deferred.then(
                function(message){
                    // sottoscrizione del CLIENT TOPIC (personale del player)
                    haBroker.subscribe(scope.clientTopic, scope.getClientTopicMessage);

                    // registrazione del player nel back-end
                    var pars = {
                        method:'POST',
                        url:haBackend.getBackend()+'/games/1.0/tris/player/'+haBroker.clientID+'/subscribe'
                    };
                    $http(pars).then(
                        function successCallback(response) {
                            //alert(response.data.status);
                        },
                        function errorCallback(response) {
                        }
                    );
                },
                function(message){
                    alert('Promise rejected with message: '+message);
                });
            // ================================================================================
        }
    };
});
