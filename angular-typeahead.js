angular.module('angular-typeahead', [])
  .directive('ng-typeahead', function () {
    return {
      restrict: 'C',
      scope: {
        datasets: '='
      },
      link: function (scope, element) {
        element.typeahead(scope.datasets);
      }
    };
  });