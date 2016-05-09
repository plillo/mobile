'use strict';
angular.module('news.directives', []);

//ADD 'appSearchTopics' directive
//...............................
angular.module('news.directives').directive('newsSearchTopics', function(news) {
    return {
        replace: false,
        scope: {
            topicsSelected: '=topicsSelectedAttr'
        },
        templateUrl : 'templates/news/search-news.html',
        controller: function($scope, $window, $element){
            // scope properties
            $scope.results = [];

            // scope methods
            $scope.select = function(index) {
                $scope.topicsSelected.push($scope.results[index]);
                $scope.results.splice(index,1);
            };

            $scope.unselect = function(index) {
                $scope.results.push($scope.categoriesSelected[index]);
                $scope.topicsSelected.splice(index,1);
            };

            $scope.change = function(event) {
                var key = $(event.target).val();

                news.getTopicsBySearchKeyword(key).then(
                    function successCallback(response) {
                        $scope.results = response.data;
                    },
                    function errorCallback(response) {
                        alert('error');
                    });
            }
        },
        link: function(scope, element, attributes){
            // EVENTS BINDING
            element.find('#search').bind('change', scope.change);
        }
    };
});
