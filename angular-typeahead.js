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
          var getValueKey = function() {
              if ($.isArray(scope.datasets)) {
                  for (var i=0;i<scope.datasets.length;i++) {
                      if (scope.datasets[i].name ==  scope.selectedDataset) {
                          return scope.datasets[i].valueKey;
                      }
                  }
              } else {
                  return scope.datasets.valueKey;
              }
              return undefined;
          }

          var onDatumSelected = function(object, datum, dataset) {
              var valueKey = getValueKey();
              if(valueKey && datum.hasOwnProperty(valueKey)) {
                  scope.ngModel = datum[valueKey];
              } else scope.ngModel = datum;
              scope.selectedDataset = dataset;
          }

        // Updates the ngModel binding when a value is manually selected from the dropdown.
        // ToDo: Think about how the value could be updated on user entry...
        element.bind('typeahead:selected', function (object, datum, dataset) {
          scope.$apply(function() {
              onDatumSelected(object, datum, dataset);
          });
        });

        // Updates the ngModel binding when a query is autocompleted.
        element.bind('typeahead:autocompleted', function (object, datum, dataset) {
          scope.$apply(function() {
              onDatumSelected(object, datum, dataset);
          });
        });


        // Updates typeahead when ngModel changed.
        scope.$watch('ngModel', function (newVal) {
            var valueKey = getValueKey();
            if (newVal && valueKey && newVal.hasOwnProperty(valueKey)) {
                newVal = newVal[valueKey];
            }
            element.typeahead('setQuery', newVal || '');
        });
      }
    };
  });
