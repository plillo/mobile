angular.module('starter')

/* BACKEND configuration and run*/
.config(function(haBackendProvider){
    haBackendProvider.setBackend('http://92.222.79.219:8181');
})
.run(function(haBackend){})

/* BROKER configuration */
.config(function(haBrokerProvider){
    haBrokerProvider.initBroker('92.222.79.219', 61614);
})
;
