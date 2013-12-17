angular.module('siyfion.sfTypeahead', [])
  .directive('sfTypeahead', function () {
    return {
      restrict: 'ACE',
      scope: {
        datasets: '=',
        ngModel: '='
      },
      link: function (scope, element) {
        var localChange = false;
        element.typeahead(scope.datasets);

        function updateScope (object, datum, dataset) {
          // for some reason $apply will place [Object] into element, this hacks around it
          var preserveVal = element.val();
          scope.$apply(function () {
            localChange = true;
            scope.ngModel = datum;
            scope.selectedDataset = dataset;
          });
          element.val(preserveVal);
        }

        // Updates the ngModel binding when a value is manually selected from the dropdown.
        element.bind('typeahead:selected', function(object, datum, dataset) {
          updateScope(object, datum, dataset);
          scope.$emit('typeahead:selected');
        });

        // Updates the ngModel binding when a query is autocompleted.
        element.bind('typeahead:autocompleted', function(object, datum, dataset) {
          updateScope(object, datum, dataset);
          scope.$emit('typeahead:autocompleted');
        });

        // Updates the ngModel binding when the user manually enters some text
        element.bind('input', function () {
          scope.$apply(function () {
            localChange = true;
            var value = element.val();
            scope.ngModel = value;
          });
        });

        // Updates typeahead when ngModel changed.
        scope.$watch('ngModel', function (newVal) {
          var valueKey;
          if (localChange) {
            localChange = false;
            return;
          }

          if ($.isArray(scope.datasets)) {
            for (var i = 0; i < scope.datasets.length; i++) {
              if (scope.datasets[i].name ==  scope.selectedDataset) {
                valueKey = scope.datasets[i].valueKey;
                break;
              }
            }
          } else {
            valueKey = scope.datasets.valueKey;
          }

          if (newVal && valueKey && newVal.hasOwnProperty(valueKey)) {
            newVal = newVal[valueKey];
          }
          element.typeahead('setQuery', newVal || '');
        });
      }
    };
  });

