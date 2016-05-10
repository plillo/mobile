angular.module('news.services',[]);

// *********************
// ADD 'news' service
// =====================

angular.module('news.services').factory('news', function($http, $rootScope) {
    return {
        createNews: function(data){
            return $http.put($rootScope.urlBackend+'/news/1.0/news/', data); // return promise
        },
        updateNews: function(uuid, data){
            return $http.post($rootScope.urlBackend+'/news/1.0/news/'+uuid, data); // return promise
        },
        deleteNews: function(uuid){
            var pars = {
                method:'DELETE',
                url:$rootScope.urlBackend+'/news/1.0/news/'+uuid
            };
            return $http(pars); // return promise
        },
        getNews: function(uuid){
            var pars = {
                method:'GET',
                url: $rootScope.urlBackend+'/news/1.0/news/'+uuid
            };
            return $http(pars); // return promise
        },
        getListNews: function(){
            var pars = {
                method:'GET',
                url:$rootScope.urlBackend+'/news/1.0/news/'+uuid
            };
            return $http(pars); // return promise
        },
        getListNewsByTopic: function(topic){
            var pars = {
                method:'GET',
                url: $rootScope.urlBackend+'/news/1.0/news/by_topic/'+topic
            };
            return $http(pars); // return promise
        },
        getListNewsByTag: function(tag){
            var pars = {
                method:'GET',
                url: $rootScope.urlBackend+'/news/1.0/news/by_tag/'+tag
            };
            return $http(pars); // return promise
        },
        getTopicsByKeyword: function(key){
            var pars = {
                method:'GET',
                url: $rootScope.urlBackend+'/news/1.0/topics/by_key/'+key
            };
            return $http(pars); // return promise
        }
    }
});