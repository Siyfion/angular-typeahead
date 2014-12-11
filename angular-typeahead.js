angular.module('siyfion.sfTypeahead', [])
  .directive('sfTypeahead', function () {
    return {
      restrict: 'AC',       // Only apply on an attribute or class
      require: '?ngModel',  // The two-way data bound value that is returned by the directive
      scope: {
        options: '=',       // The typeahead configuration options (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options)
        datasets: '=',      // The typeahead datasets to use (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets)
        suggestionKey : '@'
      },
      link: function (scope, element, attrs, ngModel) {
        var options = scope.options || {},
            datasets = (angular.isArray(scope.datasets) ? scope.datasets : [scope.datasets]) || []; // normalize to array

        // Create the typeahead on the element
        element.typeahead(scope.options, scope.datasets);

        // Parses and validates what is going to be set to model (called when: ngModel.$setViewValue(value))
        ngModel.$parsers.push(function (fromView) {
          // Assuming that all objects are datums
          // See typeahead basics: https://gist.github.com/jharding/9458744#file-the-basics-js-L15
          var isDatum = angular.isObject(fromView);
          if (options.editable === false) {
            ngModel.$setValidity('typeahead', isDatum);
            return isDatum ? fromView : undefined;
          }

          return fromView;
        });

        // Formats what is going to be displayed (called when: $scope.model = { object })
        ngModel.$formatters.push(function (fromModel) {
          if (angular.isObject(fromModel)) {
            var newViewValue;
            $.each(datasets, function (index, dataset) {
              var displayKey = dataset.displayKey || 'value',
              value = (angular.isFunction(displayKey) ? displayKey(fromModel) : fromModel[displayKey]) || '';

              if (value && !newViewValue) {
                newViewValue = value;
              }
            });
            return newViewValue;
          } else if (fromModel == null) {
            //fromModel has been set to null or undefined
            element.typeahead('val', null);
            return;
          } else {
            return fromModel;
          }
        });

        function updateScope (object, suggestion, dataset) {
          scope.$apply(function () {
            var newViewValue = (angular.isDefined(scope.suggestionKey)) ?
                suggestion[scope.suggestionKey] : suggestion;
            ngModel.$setViewValue(newViewValue);
          });
        }

        // Update the value binding when a value is manually selected from the dropdown.
        element.bind('typeahead:selected', function(object, suggestion, dataset) {
          updateScope(object, suggestion, dataset);
          scope.$emit('typeahead:selected', suggestion, dataset);
        });

        // Update the value binding when a query is autocompleted.
        element.bind('typeahead:autocompleted', function(object, suggestion, dataset) {
          updateScope(object, suggestion, dataset);
          scope.$emit('typeahead:autocompleted', suggestion, dataset);
        });

        // Propagate the opened event
        element.bind('typeahead:opened', function() {
          scope.$emit('typeahead:opened');
        });

        // Propagate the closed event
        element.bind('typeahead:closed', function() {
          scope.$emit('typeahead:closed');
        });

        // Propagate the cursorchanged event
        element.bind('typeahead:cursorchanged', function(event, suggestion, dataset) {
          scope.$emit('typeahead:cursorchanged', event, suggestion, dataset);
        });
      }
    };
  });
