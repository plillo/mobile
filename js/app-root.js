angular.module('starter', ['ionic', 'ion-datetime-picker', 'uiGmapgoogle-maps', 'hashServices', 'hashDirectives', 'controllers', 'business.controllers', 'business.services', 'business.directives', 'business.develop.directives', 'business.develop.controllers', 'news.controllers', 'news.services', 'news.directives', 'ionic-material', 'ionMdInput', 'games.develop.directives'])

.run(function($rootScope){
    $rootScope.dateValue = new Date();
    $rootScope.timeValue = new Date();
    $rootScope.datetimeValue = new Date();
})

/* IONIC PLATFORM configuration and run */
/* ==================================== */
.config(function($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
})

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

/* APPLICATION configuration and run*/
.config(function(haApplicationProvider){
    haApplicationProvider.setAppcode('bsnss-v1.0');
    haApplicationProvider.setDescription('Profiler 1.0');
})
.run(function(haApplication){})

.run(function(haConsole){})

/* LOGGER configuration */
.config(function(haLoggerProvider){
    haLoggerProvider.setPath('users/1.0/');
})
;
