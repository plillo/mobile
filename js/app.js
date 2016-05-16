angular.module('starter', ['ionic', 'uiGmapgoogle-maps', 'hashServices', 'hashDirectives', 'controllers', 'business.controllers', 'business.services', 'business.directives', 'news.controllers', 'news.services', 'news.directives', 'ionic-material', 'ionMdInput'])

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


/* HASH PLATFORM configuration and run  */
/* ==================================== */
/* BACKEND configuration and run*/
.config(function(haBackendProvider){
    haBackendProvider.setBackend('http://52.28.84.18:8181');
})
.run(function(haBackend){})

/* BROKER configuration */
.config(function(haBrokerProvider){
    //haBrokerProvider.initBroker('52.28.84.18', 61614);
    haBrokerProvider.initBroker('localhost', 61614);
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

    
/* ROUTING configuration and run        */
/* ==================================== */
/* STATES */
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app.html',
        controller: 'AppCtrl'
    })

    .state('app.inspect', {
        url: '/inspect',
        views: {
            'menuContent': {
                templateUrl: 'templates/inspect.html',
                controller: 'InspectCtrl'
            },
            'fabContent': {
                template: '<button id="fab-bug" class="button button-fab button-fab-top-left expanded button-energized-900 flap"><i class="icon ion-bug"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-bug').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })
  
    .state('app.landingpage', {
        url: '/landingpage',
        views: {
            'menuContent': {
                templateUrl: 'templates/landingpage.html',
                controller: 'LandingPageCtrl'
            }
        }
    })
   
    .state('app.qrcode', {
        url: '/qrcode',
        views: {
            'menuContent': {
                templateUrl: 'templates/qrcode.html',
                controller: 'QRCodeCtrl'
            },
            'fabContent': {
                template: '<button id="fab-qrcode" class="button button-fab button-fab-top-left expanded button-energized-900 flap"><i class="icon ion-ios-barcode"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-qrcode').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.news', {
        url: '/news',
        views: {
            'menuContent': {
                templateUrl: 'templates/news/main.html',
                controller: 'NewsPageCtrl'
            }
        }
    })

    .state('app.news.add', {
        url: '/news-add',
        views: {
            'inner': {
                templateUrl: 'templates/news/add.html',
                controller: 'NewsCtrl'
            }
        }
    })

    .state('app.news.list', {
        url: '/news-list',
        views: {
            'inner': {
                template: '***LIST***'
            }
        }
    })

    .state('app.channels', {
        url: '/channels',
        views: {
            'menuContent': {
                templateUrl: 'templates/channels.html',
                controller: 'ChannelsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-channels" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-barcode"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-channels').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })
    
    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })
      
    .state('app.invite', {
        url: '/invites',
        views: {
            'menuContent': {
                templateUrl: 'templates/invites/main.html',
                controller: 'InviteMainCtrl'
            }
        }
    })
    
    .state('app.invite.add', {
        url: '/add-invite',
        views: {
            'inner': {
                templateUrl: 'templates/invites/add.html',
                controller: 'InviteCtrl'
            }
        }
    })

    .state('app.invite.response', {
        url: '/add-response',
        params: {
            message: ''
        },
        views: {
            'inner': {
                templateUrl: 'templates/invites/response.html',
                controller: 'InviteResponseCtrl'
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })
 
    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.service', {
        url: '/service',
        views: {
            'menuContent': {
                templateUrl: 'templates/service.html',
                controller: 'ServiceCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.help', {
        url: '/help',
        views: {
            'menuContent': {
                templateUrl: 'templates/help.html',
                controller: 'HelpCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.info', {
        url: '/info',
        views: {
            'menuContent': {
                templateUrl: 'templates/info.html',
                controller: 'InfoCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
    
    .state('app.lookingfor', {
        url: '/lookingfor',
        views: {
            'menuContent': {
                templateUrl: 'templates/lookingfor.html',
                controller: 'LookingForCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    // SUBSCRIPTIONS
    //...............................................................
    .state('app.subscriptions', {
        url: '/subscriptions',
        views: {
            'menuContent': {
                templateUrl: 'templates/business/subscriptions/main.html',
                controller: 'SubscriptionsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-newsubscription" class="button button-fab button-fab-top-left expanded button-energized-900 flap" ng-click="click()"><i class="icon ion-plus"></i></button>',
                controller: function ($scope, $state, $timeout) {
                    $timeout(function () {
                        document.getElementById('fab-newsubscription').classList.toggle('on');
                    }, 200);

                    $scope.click = function() {
                        $state.go('app.subscriptions.newsubscription');
                    };
                }
            }
        }
    })

    .state('app.subscriptions.newsubscription', {
        url: '/new-subscription',
        views: {
            'inner': {
                template: '<app-search-business></app-search-business>',
                controller: 'NewSubscriptionCtrl'
            }
        }
    })

    .state('app.subscriptions.map', {
        url: '/map',
        views: {
            'inner': {
                template: '<ui-gmap-google-map center="map.center" zoom="map.zoom" control="map.control"></ui-gmap-google-map>',
                controller: 'MapSubscriptionsCtrl'
            }
        }
    })

    // ATTRIBUTES
    //...............................................................
    .state('app.userattributes', {
        url: '/userattributes',
        views: {
            'menuContent': {
                templateUrl: 'templates/attributes/user-attributes.html',
                controller: 'UserAttributesCtrl'
            },
            'fabContent': {
                template: '<button id="fab-userattributes" class="button button-fab button-fab-top-right expanded button-energized-900 flap" ng-click="click()"><i class="icon ion-plus"></i></button>',
                controller: function ($scope, $state, $timeout) {
                    $timeout(function () {
                        document.getElementById('fab-userattributes').classList.toggle('on');
                    }, 200);

                    $scope.click = function() {
                        $state.go('app.newattribute');
                    };
                }
            }
        }
    })

    .state('app.newattribute', {
        url: '/newattribute',
        views: {
            'menuContent': {
                templateUrl: 'templates/attributes/new-attribute.html',
                controller: 'NewAttributeCtrl'
            },
            'fabContent': {
                template: '',
                controller: function () {
                }
            }
        }
    })

    .state('app.editattribute', {
        url: '/editattribute/:uuid',
        views: {
            'menuContent': {
                templateUrl: 'templates/attributes/edit-attribute.html',
                controller: 'EditAttributeCtrl'
            },
            'fabContent': {
                template: '',
                controller: function () {
                }
            }
        }
    })
    
    // MANAGE OWNED BUSINESSES (MENU)
    //...............................................................
    .state('app.businessmanager', {
        url: '/businesses-manager',
        views: {
            'menuContent': {
                templateUrl: 'templates/business/main.html',
                controller: 'BusinessManagerCtrl'
            },
            'fabContent': {
                template: '<button id="fab-business-manager" class="button button-fab button-fab-top-left expanded button-energized-900 flap" ng-click="click()"><i class="icon ion-plus"></i></button>',
                controller: function ($scope, $state, $timeout) {
                    $timeout(function () {
                        document.getElementById('fab-business-manager').classList.toggle('on');
                    }, 900);
                    
                    $scope.click = function() {
                    	$state.go('app.business-manager.createbusiness');
                    };
                }
            }
        }
    })
    
        // CREATE BUSINESS
        .state('app.businessmanager.create', {
            url: '/create',
            views: {
                'inner': {
                    template: '<app-business-form></app-business-form>',
                    controller: 'CreateBusinessCtrl'
                }
            }
        })

        // LIST BUSINESSES
        .state('app.businessmanager.list', {
                url: '/list',
                views: {
                    'inner': {
                        template: '<app-owned-business></app-owned-business>'
                    }
                }
            })

        // MAP ALL BUSINESSES
        .state('app.businessmanager.map', {
            url: '/map',
            views: {
                'inner': {
                    template: '<ui-gmap-google-map center="map.center" zoom="map.zoom" control="map.control"></ui-gmap-google-map>',
                    controller: 'MapBusinessesCtrl'
                }
            }
        })

    // MANAGE BUSINESS (MENU)
    .state('app.businessmanager.business', {
        url: '/business/:uuid',
        views: {
            'inner': {
                templateUrl: 'templates/business/business/main.html',
                controller: 'BusinessMainCtrl'  // js/business/controllers.js
            }
        }
    })

        // MAP BUSINESS
        .state('app.businessmanager.business.map', {
            url: '/map',
            views: {
                'subinner': {
                    template: '<ui-gmap-google-map center="map.center" zoom="map.zoom" control="map.control"></ui-gmap-google-map>',
                    controller: 'MapBusinessCtrl'
                }
            }
        })

        // UPDATE BUSINESS
        .state('app.businessmanager.business.update', {
                url: '/update',
                views: {
                    'subinner': {
                        template: '<app-owned-business-form uuid="{{uuid}}"></app-owned-business-form>'
                    }
                }
            })

    // MANAGE SUBSCRIBERS (MENU)
    .state('app.businessmanager.business.subscribersmanager', {
        url: '/subscribersmanager',
        views: {
            'subinner': {
                templateUrl: 'templates/business/subscribers/main.html'
            }
        }
    })
        
        .state('app.businessmanager.business.subscribersmanager.create', {
            url: '/create',
            views: {
                'subscribers-inner': {
                    template: 'Aggiunta subscriber'
                }
            }
        })

        .state('app.businessmanager.business.subscribersmanager.list', {
            url: '/list',
            views: {
                'subscribers-inner': {
                    template: 'Elenco subscribers'
                }
            }
        })

    // MANAGE PRODUCTS (MENU)
    .state('app.businessmanager.business.productsmanager', {
        url: '/productsmanager',
        views: {
            'subinner': {
                templateUrl: 'templates/business/products/main.html',
                controller: 'ProductsMainCtrl'
            }
        }
    })

        .state('app.businessmanager.business.productsmanager.create', {
            url: '/productcreate',
            views: {
                'products-inner': {
                    template: '<app-product-form></app-product-form>'
                }
            }
        })

        .state('app.businessmanager.business.productsmanager.list', {
            url: '/productlist',
            views: {
                'products-inner': {
                    template: '<app-product-list></app-product-list>'
                }
            }
        })

        .state('app.businessmanager.business.servicesmanager', {
            url: '/servicesmanager',
            views: {
                'subinner': {
                    templateUrl: 'templates/business/services/main.html',
                    controller: 'ServicesMainCtrl'
                }
            }
        })

    // MANAGE PROMOTIONS (MENU)
    .state('app.businessmanager.business.servicesmanager.promotionsmanager', {
        url: '/promotionsmanager',
        views: {
            'services-inner': {
                templateUrl: 'templates/business/services/promotions/main.html'
            }
        }
    })

        .state('app.businessmanager.business.servicesmanager.promotionsmanager.create', {
            url: '/create',
            views: {
                'promotions-inner': {
                    templateUrl: 'templates/business/services/promotions/create.html'
                }
            }
        })

        .state('app.businessmanager.business.servicesmanager.promotionsmanager.list', {
            url: '/list',
            views: {
                'promotions-inner': {
                    template: 'list'
                }
            }
        })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/landingpage');
});
