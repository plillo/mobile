angular.module('news.services',[]);

// *********************
// ADD 'news' service
// =====================

angular.module('news.services').factory('news', function($http, $rootScope, $q) {
    return {
        createNews: function(data){
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve({uuid:'8213548-af45-bca2-cfa3-a1324bc324f1', title:data.title, description:data.description});
            }, 300);

            return deferred.promise; // return promise
        },
        updateNews: function(uuid, data){
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve({uuid:uuid, title:data.title, description:data.description});
            }, 300);

            return deferred.promise; // return promise
        },
        deleteNews: function(uuid){
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve({deleted:true});
            }, 300);

            return deferred.promise; // return promise
        },
        getNews: function(uuid){
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve({uuid:uuid, title:'mocked title', description:'mocked description'});
            }, 300);

            return deferred.promise; // return promise
        },
        getListNews: function(){
            var list = [];
            list.push({uuid:'11111111-af45-bca2-cfa3-a1324bc324f1', title:'mocked title 1', description:'mocked description 1'});
            list.push({uuid:'22222222-af45-bca2-cfa3-a1324bc324f1', title:'mocked title 2', description:'mocked description 2'});
            list.push({uuid:'33333333-af45-bca2-cfa3-a1324bc324f1', title:'mocked title 3', description:'mocked description 3'});
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(list);
            }, 300);

            return deferred.promise; // return promise
        },
        getListNewsByTopic: function(topic){
            return getListNews(); // return promise
        },
        getListNewsByTag: function(tag){
            return getListNews(); // return promise
        },
        getTopicsBySearchKeyword: function(key){
            var list = [];
            list.push({uuid:'11111111-af45-bca2-cfa3-a1324bc324f1', title:'mocked 1', description:'mocked topic 1'});
            list.push({uuid:'22222222-af45-bca2-cfa3-a1324bc324f1', title:'mocked 2', description:'mocked topic 2'});
            list.push({uuid:'33333333-af45-bca2-cfa3-a1324bc324f1', title:'mocked 3', description:'mocked topic 3'});
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(list);
            }, 300);

            return deferred.promise; // return promise
        }
    }
});