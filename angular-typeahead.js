angular.module('siyfion.ngTypeahead', [])
  .directive('ngTypeahead', function () {
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