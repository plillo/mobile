angular.module('hashServices',['ngStorage']);

//************************************
//ADD 'haJwt' service
//====================================
angular.module('hashServices').service('haJwt', function() {
	
	// <<urlBase64Decode>> function
	// ----------------------------
    this.urlBase64Decode = function(str) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: { break; }
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default: {
                throw 'Illegal base64url string!';
            }
        }
        return decodeURIComponent(escape(window.atob(output)));
    };

	// <<decodeToken>> function
	// ------------------------
    this.decodeToken = function(token) {
        var parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }

        return JSON.parse(decoded);
    };

	// <<getTokenExpirationDate>> function
	// -----------------------------------
    this.getTokenExpirationDate = function(token) {
        var decoded;
        decoded = this.decodeToken(token);

        if(typeof decoded.exp === "undefined") {
            return null;
        }

        var d = new Date(0);
        d.setUTCSeconds(decoded.exp);

        return d;
    };

	// <<isTokenExpired>> function
	// ---------------------------
    this.isTokenExpired = function(token, offsetSeconds) {
        var d = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (d === null)
            return false;

        return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
});

//************************************
//ADD 'haApplication' service
//====================================
angular.module('hashServices').provider('haApplication', function() {
	this.appcode = undefined;
	this.description = undefined;
	
	//$get function returning the service
	this.$get = function($rootScope){
		var appcode = this.appcode;
		var description = this.description;

		return {
			appcode: appcode,
			description: description
		}
	};

	this.setAppcode = function(appcode){
		this.appcode = appcode;
	};

	this.setDescription = function(description){
		this.description = description;
	};
});

//************************************
//ADD 'haBackend' service
//====================================
angular.module('hashServices').provider('haBackend', function() {
	this.url = undefined;

	//$get function returning the service
	this.$get = function($localStorage, $rootScope){
		if($localStorage.urlBackend==undefined){
			if(this.url!=undefined) {
				$localStorage.urlBackend = this.url;
				$rootScope.urlBackend = this.url;
			}
		}
		else {
			$rootScope.urlBackend = $localStorage.urlBackend;
			this.url = $localStorage.urlBackend;
		}

		var url = this.url;

		return {
			url: url,

			getBackend: function(){
				if(!$localStorage.urlBackend || $localStorage.urlBackend==''){
					$localStorage.urlBackend = 'http://52.28.84.18:8181';  // default
					$rootScope.urlBackend = url;
				}
				return $localStorage.urlBackend;
			},
			setBackend: function(url){
				this.url = url;
				$localStorage.urlBackend = url;
				$rootScope.urlBackend = url;
			}
		}
	};

	this.setBackend = function(url){
		this.url = url;
	};
});

//************************************
//ADD 'haConsole' service
//====================================
angular.module('hashServices').service('haConsole', function() {
	this.console = [];

	this.log = function(message){
		this.console.push(message);
	};
});

//***********************************
//ADD and RUN 'haUser' service
//===================================
angular.module('hashServices').service('haUser', function($http, $localStorage, $rootScope, $window, $q, haApplication, haJwt) {
    this.currentUser = undefined;

	// <<setCurrentUser>> function
	// ---------------------------
    this.setCurrentUser = function(currentUser) {
        this.currentUser = currentUser;
        $localStorage.currentUser = currentUser;
        $rootScope.currentUser = currentUser;

        // brodcast event
        $rootScope.$broadcast('user-setted');
        
        return this.currentUser;
    };

    // <<resetCurrentUser>> function
    // -----------------------------
    this.resetCurrentUser = function() {
        this.currentUser = undefined;
        delete $localStorage.currentUser;

        // brodcast event
        $rootScope.$broadcast('user-resetted');
    };

	// <<getCurrentUser>> function
	// ---------------------------
    this.getCurrentUser = function() {
        return this.currentUser;
    };

	// <<isLoggedUser>> function
	// -------------------------
    this.isUserLogged = function() {
        return !(this.currentUser==undefined);
    };
    
	// <<isLoggedUser>> function
	// -------------------------
    this.isUserInRole = function(role) {
        if(this.currentUser==undefined || this.currentUser.roles==undefined)
        	return false;
        
        return (this.currentUser.roles.indexOf(role) > -1);
    };

    // <<getUserAttributeValue>> function
    // ---------------------------
    this.getUserAttributeValue = function(uuid){
        for(var k=0; k<this.currentUser.attributeValues.length; k++) {
            if(this.currentUser.attributeValues[k].uuid==uuid)
                return this.currentUser.attributeValues[k].value;
        }
        
        return undefined;
    }
    
	// <<setUserByToken>> function
	// ---------------------------
	this.setUserByToken = function(token){
		// set TOKEN in session storage
		$window.sessionStorage.token = token;
        
		// decode token
		var decrypted = haJwt.decodeToken(token);

		var currentUser = {
			uuid:decrypted.uuid,
			username:decrypted.username,
			email:decrypted.email,
			mobile:decrypted.mobile,
			password:'',
			firstName:decrypted.firstName,
			lastName:decrypted.lastName,
			roles:decrypted.roles,
			attributeValues: decrypted.attributeValues,
			attributeTypes: decrypted.attributeTypes,
			accessToken: token
		};
		// Set user
		this.setCurrentUser(currentUser);
	}

    // <<create>> function
    // -------------------
    this.createUser = function(identificator, password){
        var self = this;
        var pars = {
            method: 'POST',
            url: $rootScope.urlBackend+'/users/1.0/',
            params: {
                identificator: identificator,
                password: password
            }
        };
        $http(pars).then(
            function successCallback(response) {
                $rootScope.response = response;
                if(response.status==401) {
                    resetCurrentUser();
                    return;
                };

                // Set user
                self.setUserByToken(response.data.token);

                $rootScope.$broadcast('user-authorized');
            },
            function errorCallback(response) {
                $rootScope.response = response;
                // TODO: handle the case of error creating user
                alert('KO');
            });
    };

	// <<updateUser>> function
	// -----------------------
    this.updateUser = function(updatingUser){
		var self = this; // alias for this in closure

        var deferred = $q.defer();
	   	var data = {
	     	firstName: updatingUser.firstName,
	     	lastName: updatingUser.lastName,
	     	username: updatingUser.username,
    	 	email: updatingUser.email,
    	 	mobile: updatingUser.mobile,
    	 	attributes: updatingUser.attributes
       	};

        $http.post($rootScope.urlBackend+'/users/1.0/'+$rootScope.currentUser.uuid+'/update', data).then(
			function successCallback(response) {
                if(response.data.token==undefined)
                    alert('missing updated token in response!');
                else {
				    self.setUserByToken(response.data.token);
                    // publish event
                    $rootScope.$broadcast('user-updated');
                }

                // Resolve
				deferred.resolve('OK');
			},
			function errorCallback(response) {
                // Reject
				deferred.reject('KO');
			}
		);

		return deferred.promise;

	   //return $http.post($rootScope.urlBackend+'/users/1.0/'+$rootScope.currentUser.uuid+'/update', data);
	};

	// <<getUserPosition>> function
	// ----------------------------
	this.getUserArea = function(){
		var pars = {
			method:'GET',
			url: $rootScope.urlBackend+'/users/1.0/'+$rootScope.currentUser.uuid+'/area'
		};
		return $http(pars); // return promise
	};

	this.setUserArea = function(area){
		return $http.put($rootScope.urlBackend+'/users/1.0/'+$rootScope.currentUser.uuid+'/area', area); // return promise
	};

	// <<getUserLocationByIP>> function
	// ----------------------------
	this.getUserLocationByIP = function(){
		var pars = {
			method:'GET',
			url: 'http://ip-api.com/json'
		};
		return $http(pars); // return promise
	};
	
	// <<invite>> function
	// -------------------
    this.inviteUser = function(invites){
       return 'Delivered n.'+invites.length+' invites to sending service';
       /*
	   var data = {
    	 invites: invites
       };
 
	   return $http.post($rootScope.urlBackend+'/users/1.0/'+$rootScope.currentUser.uuid+'/invite', data);
	   */
	};
});
angular.module('hashServices').run(function($localStorage, haUser) {
	haUser.setCurrentUser($localStorage.currentUser);
});

//*************************************************************************
//ADD and REGISTER 'haAuthInterceptor' service as $httpProvider interceptor
//=========================================================================
angular.module('hashServices').factory('haAuthInterceptor', function($rootScope, $q, $window) {
	return {
		// <<request>> function
		// --------------------
		request : function(config) {
			config.headers = config.headers || {};
			if ($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}
			return config;
		},
		// <<response>> function
		// ---------------------
		response : function(response) {
			if (response.status === 401) {
				// TODO: handle the case where the user is not authenticated
			}
			return response || $q.when(response);
		}
	};
});
angular.module('hashServices').config(function($httpProvider) {
	$httpProvider.interceptors.push('haAuthInterceptor');
});

//***********************************
//ADD 'haLogger' service
//===================================
angular.module('hashServices').provider('haLogger', function() {
	this.path = undefined;

	// $get function returning the service
	this.$get = function($http, $rootScope, $window, haUser, haBackend, haJwt, haApplication){
		var path = this.path;

		return {
			path: path,

			// <<getUrl>> function
			// -------------------
			getUrl: function(){
				return $rootScope.urlBackend+'/'+this.path;
			},

			// <<login>> function
			// ------------------
			login: function(identificator, password){
			    var pars = {
				    method:'GET',
				    url:haBackend.getBackend()+'/'+this.path+'login',
				    params:{
					    identificator:identificator,
					    password:password,
					    appcode:haApplication.appcode
				    }
			    };

                // LOGIN
			    $http(pars).then(
                    function successCallback(response) {
                        $rootScope.response = response;
                        if(response.status==401) {
                            haUser.resetCurrentUser();
                            return;
                        };

                        // Set user
                        haUser.setUserByToken(response.data.token);

                        // publish event
                        $rootScope.$broadcast('user-logged');
                    },
                    function errorCallback(response) {
                        // delete TOKEN from session storage
                        delete $window.sessionStorage.token;

                        $rootScope.response = response;
                            alert('KO');
                   }
                );
			},

            // <<logout>> function
			// -------------------
			logout: function(){
				haUser.resetCurrentUser();
			},

			// <<validateIdentificator>> function
			// ----------------------------------
			validateIdentificator: function(identificator, deferred, ctrl){
			   var pars = {
				  method:'GET',
				  url:haBackend.getBackend()+'/'+this.path+'validateIdentificator',
				  params:{
					 value:identificator
				  }
			   };
			   $http(pars).then(
				  function successCallback(response) {
					  $rootScope.response = response;
					  ctrl.identificatorType = response.data.identificatorType;

					  if(response.data.matched){
						  ctrl.matched = true;
					  }
					  else {
						  ctrl.matched = false;
					  }

					  if(response.data.identificatorType=='unmatched')
						  ctrl.mode = 'invalid';
					  else if(response.data.matched)
						  ctrl.mode = 'login';
					  else
						  ctrl.mode = 'create';

					  // REJECT if invalid identificator type
					  if(response.data.identificatorType=='unmatched')
						  deferred.reject();
					  else
						  deferred.resolve();
				   },
				   function errorCallback(response) {
						  $rootScope.response = response;
						  alert('validateIdentificator: ERROR');
						  deferred.reject();
				   }
				);
			}
		}
	};

	// Set logging PATH
	this.setPath = function(path){
		this.path = path;
	};
});

//***********************************
//ADD 'broker' service
//===================================
angular.module('hashServices').provider('haBroker', function() {
	// provider object reference
	var provider = this;
	
	this.client = undefined;
	this.url = undefined;
	this.port = undefined;
	this.clientID = Math.random().toString(12);
	this.topicHandlers = new Map();
  
	// $get function returning the service
	this.$get = function($q, $rootScope, haConsole){
		return {
			url: provider.url,
			port: provider.port,
			clientID: provider.clientID,
			deferred: undefined,
			connected: false,

			// <<setDeferred>> function
			// ------------------------
			getDeferred: function(){
				return this.deferred;
			},
			
			// <<isConnected>> function
			// ------------------------
			isConnected: function(){
				return this.connected;
			},

			// <<setUrl>> function
			// -------------------
			setUrl: function(url){
				this.url = url;
			},

			// <<getUrl>> function
			// -------------------
		    getUrl: function(){
		    	return this.url;
		    },

			// <<setPort>> function
			// --------------------
			setPort: function(port){
				this.port = port;
			},

			// <<restart>> function
			// --------------------
			restart: function(){
				//TODO meccanismo di riconnessione
			},
		    
			// <<getPort>> function
			// -------------------
		    getPort: function(){
		    	return this.port;
		    },
			
			// <<connect>> function
			// --------------------
			connect: function(token, password){
				haConsole.log('Connecting to broker at '+provider.url+':'+provider.port+'...');

				// service object reference
				var service = this;

				if(provider.client){
					var deferred = $q.defer();
					$rootScope.haBrokerMessage = 'Connecting to broker at '+provider.url+':'+provider.port;
					$rootScope.haBrokerConnecting = true;
					$rootScope.haBrokerConnected = false;
					$rootScope.$apply();
					
					provider.client.connect({
	    				userName: token,
	    				password: password,
	    				onSuccess:function(frame) { // connection OK
							haConsole.log('Connected.');
	    					service.connected = true;
	    					deferred.resolve('Connected to the broker!');
	    					$rootScope.haBrokerMessage = 'Connected!';
	    					$rootScope.haBrokerConnecting = false;
	    					$rootScope.haBrokerConnected = true;
	    					$rootScope.$apply();
	    				},
	    				onFailure:function(error) { // NO connection
							haConsole.log('Cannot connect to the broker: '+provider.url+':'+provider.port+' - error: '+error.errorMessage);
	    					service.connected = false;
	    					deferred.reject('Cannot connect to the broker: '+provider.url+':'+provider.port);
	    					$rootScope.haBrokerMessage = error.errorMessage;
	    					$rootScope.haBrokerConnecting = false;
	    					$rootScope.$apply();
	    				}
	    			});
			    	service.deferred = deferred.promise;
				}
				else
					alert('Broker connection error: broker not initialized yet!');
			},
			// <<subscribe>> function
			// ----------------------
			subscribe: function(topic, topicHandler, qos){
				qos = isNaN(qos) ? 0 : qos;
				haConsole.log('Subscribing topic: '+topic);

				if(provider.client){
					provider.client.subscribe(topic, {qos:qos}); // subscribe topic
					provider.topicHandlers.set(topic, topicHandler); // set topic handler
				}
				else
					alert('Topic subscription error: broker not initialized yet!');
			},
			// <<subscribe>> function
			// ----------------------
			unsubscribe: function(topic, topicHandler){
				haConsole.log('Unsubscribing topic: '+topic);

				if(provider.client){
					provider.client.unsubscribe(topic); // unsubscribe topic
					provider.topicHandlers.delete(topic); // delete topic handler
				}
				else
					alert('Topic unsubscription error: broker not initialized yet!');
			},
			// <<send>> function
			// -----------------
			send: function(status, topic, retained){
				haConsole.log('Sending message {status:'+status+'} to topic: '+topic);

				if(provider.client){
					var sendmessage = new Paho.MQTT.Message(JSON.stringify({status:status}));
					sendmessage.destinationName = topic;
					sendmessage.retained = retained;
					// send
					provider.client.send(sendmessage);
				}
				else
					alert('Send message on topic error: broker not initialized yet!');
		    }
		}
	};

	// Initialize the broker
	this.initBroker = function(url, port){
		this.url = url;
		this.port = port;

		// Set the broker client
		this.client = new Paho.MQTT.Client(url, port, this.clientID);
		// set onConnectionLost CALLBACK of the broker client
		this.client.onConnectionLost = function(responseObject) {
	        //alert('Connection lost: '+responseObject.errorCode+'-'+responseObject.errorMessage);
	    };
		// set onMessageArrived CALLBACK of the broker client
	    this.client.onMessageArrived = function(message) {
	        var topic = message.destinationName; // read topic
	        var topicHandler = provider.topicHandlers.get(topic); // get topic handler
	        // call topic handler with payload
	        if(topicHandler)
	        	topicHandler(message.payloadString);
	    };
	};
});

//INITIALIZE
//..........
angular.module('hashServices').run(function($window, haBroker) {
	var token = $window.sessionStorage.token ? $window.sessionStorage.token : '*';
	
	// Connection to the broker
	haBroker.connect(token, '*');
});
