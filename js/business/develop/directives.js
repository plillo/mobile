'use strict';
angular.module('business.develop.directives', ['ngFileUpload']);

//ADD 'appCartSelection' directive
//................................
angular.module('business.develop.directives').directive('appCartSelection', function(business, product) {
    return {
        replace: false,
        scope: {
        },
        template : '>>appCartSelection<<',
        controller: function($scope, $window, $element){
        },
        link: function(scope, element, attributes){
        }
    };
});

//ADD 'appCartView' directive
//...........................
angular.module('business.develop.directives').directive('appCartView', function(business, product) {
    return {
        replace: false,
        scope: {
        },
        template : '>>appCartView<<',
        controller: function($scope, $window, $element){
        },
        link: function(scope, element, attributes){
        }
    };
});

//ADD 'appCartCheckout' directive
//...............................
angular.module('business.develop.directives').directive('appCartCheckout', function(business, product) {
    return {
        replace: false,
        scope: {
        },
        template : '>>appCartView<<',
        controller: function($scope, $window, $element){
        },
        link: function(scope, element, attributes){
        }
    };
});