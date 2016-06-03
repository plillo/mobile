'use strict';
angular.module('games.develop.directives', ['ngFileUpload']);

//ADD 'gameTris' directive
//........................
angular.module('games.develop.directives').directive('gameTris', function(business, product) {
    return {
        replace: false,
        scope: {
        },
        template : '>>gameTris<<',
        controller: function($scope, $window, $element){
        },
        link: function(scope, element, attributes){
        }
    };
});
