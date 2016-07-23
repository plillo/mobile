/* global angular, document, window */
'use strict';

angular.module('controllers', ['ionic', 'uiGmapgoogle-maps'])

.controller('AppCtrl', function($scope, $state, $ionicModal, $ionicPopover, $timeout, haUser, haLogger) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    
    $scope.reloadPage = function(){
    	window.location.reload();
    };
    
    $scope.isUserLogged = function(){
    	return haUser.isUserLogged();
    };
    
    $scope.isBusinessUser = function(){
    	return haUser.isUserInRole('root') || haUser.isUserInRole('business.busadmin');
    };
    
    $scope.logout = function(){
        haLogger.logout();
    };
    
	$scope.exit = function() {
		window.close();
		ionic.Platform.exitApp();
	};
  
    ////////////////////////////////////////
    // Event's handlers Methods
    ////////////////////////////////////////
    
	$scope.$on('user-logged', function(event, args) {
		$state.go('app.profile');
	});

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LandingPageCtrl', function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, haBroker, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	$scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialMotion.fadeSlideInRight();
    ionicMaterialInk.displayEffect();
   
	$scope.getUrlBroker = function() {
		alert(haBroker.getUrl()+':'+haBroker.getPort()+' ['+(haBroker.isConnected()?'':'NOT ')+'CONNECTED]');
	};
})

.controller('InspectCtrl', function($scope, $localStorage, $timeout, haApplication, haConsole, haBackend, haBroker, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion) {
    // Enable dragging
    $ionicSideMenuDelegate.canDragContent(true);

    $scope.appcode = haApplication.appcode;
    $scope.appdescription = haApplication.description;
    $scope.console = haConsole.console;
    $scope.localStorage = $localStorage;
    $scope.backend = haBackend.getBackend();
    $scope.broker = { ip:haBroker.getUrl(), port:haBroker.getPort()};

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('left');

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ServiceCtrl', function($scope, haBackend, haBroker, $timeout, $stateParams, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    $scope.urlBackend = haBackend.getBackend();
    $scope.urlBroker = haBroker.getUrl();
    $scope.portBroker = haBroker.getPort();
    
    // Set Ink
    ionicMaterialInk.displayEffect();
    
	$scope.setUrlService = function(url) {
		haBackend.setBackend(url);
	};

    $scope.setUrlBroker = function(url) {
        haBroker.setUrl(url);
    };

    $scope.setPortBroker = function(port) {
        haBroker.setPort(port);
    };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, ionicMaterialInk) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	$scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
})

.controller('InviteMainCtrl', function($scope, $state, $stateParams, $ionicSideMenuDelegate, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
    
    //Default state
    $state.go('app.invite.add');
})

.controller('InviteResponseCtrl', function($scope, $state, $stateParams, $ionicSideMenuDelegate, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	$scope.message = $stateParams.message;
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('InviteCtrl', function($scope, $state, $stateParams, $ionicSideMenuDelegate, $timeout, haUser, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	$scope.isValidInvite = false;
	$scope.inviting = {};
	
	$scope.invites = [];
	
	//bindings
	$scope.addInvite = function() {
		var invite = {
			firstName: $scope.inviting.firstName,
			lastName: $scope.inviting.lastName,
			email: $scope.inviting.email
		};
		$scope.invites.splice(0,0,invite);
		$scope.inviting = {};
		$scope.isValidInvite = false;
	};

	$scope.removeInvite = function(index) {
		$scope.invites.splice(index,1);
	};
	
	$scope.sendInvites = function() {
		var msg = haUser.inviteUser($scope.invites);
	    $state.go('app.invite.response',{message: msg});
	};

	$scope.$watch('inviting.email', function(newValue, oldValue) {
		$scope.isValidInvite = newValue.length>0;
	});
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('FriendsCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $timeout, $localStorage, ionicMaterialMotion, ionicMaterialInk) {
	// Enable dragging
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('left');

    $scope.user = $localStorage.currentUser;
    
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('MapProfileCtrl', function($scope, $timeout, haUser, $ionicSideMenuDelegate, uiGmapIsReady) {
    $ionicSideMenuDelegate.canDragContent(false);

    $scope.map = {
        center: { latitude: 0, longitude: 0 },
        zoom: 10,
        control : {}
    };

    $scope.position = {};

    $scope.drawMap = function(){
        // Set map center
        $scope.map.center = { latitude: $scope.position.lat, longitude: $scope.position.lng };

        // Get Map
        var map = $scope.map.control.getGMap();
        $scope.map.control.refresh();

        // Create marker and set on map
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.position.lat, $scope.position.lng),
            title: "Business position",
            draggable: false
        });
        marker.setMap(map);

        var circleOptions = {
            center: {lat:$scope.position.lat, lng:$scope.position.lng},
            radius: $scope.position.radius,
            clickable: false,
            strokeColor: '#AA0000',
            strokeWeight: 1,
            strokeOpacity: 0.3,
            fillColor: '#AA0000',
            fillOpacity: 0.1,
            map: map,
            editable: true
        };
        var circle = new google.maps.Circle(circleOptions);
        google.maps.event.addListener(circle, 'radius_changed', function(){
            $scope.position.radius = circle.getRadius();

            // save back-end position/radius
            haUser.setUserArea($scope.position);
        });
        google.maps.event.addListener(circle, 'center_changed', function(){
            marker.setPosition(circle.getCenter());
            $scope.position.lat = circle.getCenter().lat();
            $scope.position.lng = circle.getCenter().lng();

            // save back-end position/radius
            haUser.setUserArea($scope.position);
        });
    }

    haUser.getUserArea().then(
        function successCallback(response) {
            if(response.data.setted){
                // Set position
                $scope.position = response.data.area;

                // Draw
                uiGmapIsReady.promise().then(function (maps) {
                    $scope.drawMap();
                });

                return;
            }
            else {
                // Set defaults by IP localization
                // TODO: provvisorio: implementare e usare un'API da back-end
                $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
                    $scope.position.lat = data.lat;
                    $scope.position.lng = data.lon;
                    $scope.position.radius = 5000;

                    // Draw
                    uiGmapIsReady.promise().then(function (maps) {
                        $scope.drawMap();
                    });

                    return;
                });
            }
        }
    );

    /*
    uiGmapIsReady.promise().then(function (maps) {
        haUser.getUserArea().then(
            function successCallback(response) {
                if(response.data.setted){
                    // Set position
                    $scope.position = response.data.area;
                    // Draw
                    $scope.drawMap();

                    return;
                }
                else {
                    // Set defaults by IP localization
                    // TODO: provvisorio: implementare e usare un'API da back-end
                    $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
                        $scope.position.lat = data.lat;
                        $scope.position.lng = data.lon;
                        $scope.position.radius = 5000;
                        // Draw
                        $scope.drawMap();

                        return;
                    });
                }
            },
            function errorCallback(response) {
                alert('Error loading map');
            });
    });
    */
})

.controller('QRCodeCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $timeout, ionicMaterialMotion, ionicMaterialInk) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('left');
    
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    
    // Set Motion
    ionicMaterialMotion.slideUp({
            selector: '.animate-fade-slide-in .slide-up'
    });
})

.controller('ChannelsCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $timeout, ionicMaterialMotion, ionicMaterialInk) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect(); 
})

.controller('GalleryCtrl', function($scope, $stateParams, $ionicSideMenuDelegate, $timeout, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	$scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('HelpCtrl', function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('InfoCtrl', function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('LookingForCtrl', function($scope, $timeout, $stateParams, $ionicSideMenuDelegate, ionicMaterialInk, ionicMaterialMotion) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

// ===================
// GESTIONE ATTRIBUTES
// ===================

.controller('UserAttributesCtrl', function($scope, $timeout, $ionicSideMenuDelegate, ionicMaterialInk) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('NewAttributeCtrl', function($scope, $timeout, $ionicSideMenuDelegate, ionicMaterialInk) {
	$ionicSideMenuDelegate.canDragContent(true);
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('EditAttributeCtrl', function($scope, $stateParams, $timeout, $ionicSideMenuDelegate, ionicMaterialInk) {
	$ionicSideMenuDelegate.canDragContent(true);

	$scope.uuid = $stateParams.uuid;
	
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})


;
