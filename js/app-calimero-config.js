angular.module('starter')

/* BACKEND configuration and run*/
.config(function(haBackendProvider){
    haBackendProvider.setBackend('http://calimero:8080');
})
.run(function(haBackend){})

/* BROKER configuration */
.config(function(haBrokerProvider){
    haBrokerProvider.initBroker('calimero', 61614);
})
;
