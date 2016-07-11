angular.module('starter')
    
/* BACKEND configuration and run*/
.config(function(haBackendProvider){
    haBackendProvider.setBackend('http://localhost:8080');
})
.run(function(haBackend){})

/* BROKER configuration */
.config(function(haBrokerProvider){
    haBrokerProvider.initBroker('localhost', 61614);
})
;
