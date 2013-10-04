angular.module('siyfion.sfTypeahead', [])
  .directive('sfTypeahead', function () {
    return {
      restrict: 'ACE',
      scope: {
        datasets: '=',
        ngModel: '='
      },
      link: function (scope, element) {
        element.typeahead(scope.datasets);

        // Updates the ngModel binding when a value is manually selected from the dropdown.
        // ToDo: Think about how the value could be updated on user entry...
        element.bind('typeahead:selected', function (object, datum, dataset) {
          scope.$apply(function() {
            scope.ngModel = datum;
            scope.selectedDataset = dataset;
          });
        });

        // Updates the ngModel binding when a query is autocompleted.
        element.bind('typeahead:autocompleted', function (object, datum, dataset) {
          scope.$apply(function() {
            scope.ngModel = datum;
            scope.selectedDataset = dataset;
          });
        });

        // Updates typeahead when ngModel changed.
        scope.$watch('ngModel', function (newVal) {
            if ($.isArray(scope.datasets)) {
                for (var i=0;i<scope.datasets.length;i++) {
                    if (scope.datasets[i].name ==  scope.selectedDataset) {
                        var valueKey = scope.datasets[i].valueKey;
                        break;
                    }
                }

            } else {
                var valueKey = scope.datasets.valueKey;
            }

            if (newVal && valueKey && newVal.hasOwnProperty(valueKey)) {
                newVal = newVal[valueKey];
            }
            element.typeahead('setQuery', newVal || '');
        });
      }
    };
  });
