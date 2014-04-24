angular.module('siyfion.sfTypeahead', [])
  .directive('sfTypeahead', function () {
    return {
      restrict: 'AC',       // Only apply on an attribute or class
      require: '?ngModel',  // The two-way data bound value that is returned by the directive
      scope: {
        options: '=',       // The typeahead configuration options (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options)
        datasets: '='       // The typeahead datasets to use (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets)
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
            var found = false;
            $.each(datasets, function (index, dataset) {
              var query = dataset.source,
                  displayKey = dataset.displayKey || 'value',
                  value = (angular.isFunction(displayKey) ? displayKey(fromModel) : fromModel[displayKey]) || '';

              if (found) return false; // break

              if (!value) {
                // Fakes a request just to use the same function logic
                search([]);
                return;
              }

              // Get suggestions by asynchronous request and updates the view
              query(value, search);
              return;

              function search(suggestions) {
                var exists = inArray(suggestions, fromModel);
                if (exists) {
                  ngModel.$setViewValue(fromModel);
                  found = true;
                } else {
                  ngModel.$setViewValue(options.editable === false ? undefined : fromModel);
                }

                // At this point, digest could be running (local, prefetch) or could not be (remote)
                // As bloodhound object is inaccessible to know that, simulates an async to not conflict
                // with possible running digest
                if (found || index === datasets.length - 1) {
                  setTimeout(function () {
                    scope.$apply(function () {
                      element.typeahead('val', value);
                    });
                  }, 0);
                }
              }
            });

            return ''; // loading
          }
          return fromModel;
        });

        function inArray(array, element) {
          var found = -1;
          angular.forEach(array, function (value, key) {
            if (angular.equals(element, value)) {
              found = key;
            }
          });
          return found >= 0;
        }

        function getCursorPosition (element) {
          var position = 0;
          element = element[0];

          // IE Support.
          if (document.selection) {
            var range = document.selection.createRange();
            range.moveStart('character', -element.value.length);

            position = range.text.length;
          }
          // Other browsers.
          else if (typeof element.selectionStart === 'number') {
            position = element.selectionStart;
          }
          return position;
        }

        function setCursorPosition (element, position) {
          element = element[0];
          if (document.selection) {
            var range = element.createTextRange();
            range.move('character', position);
            range.select();
          }
          else if (typeof element.selectionStart === 'number') {
            element.focus();
            element.setSelectionRange(position, position);
          }
        }

        function updateScope (object, suggestion, dataset) {
          scope.$apply(function () {
            ngModel.$setViewValue(suggestion);
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

        // Update the value binding when the user manually enters some text
        // See: http://stackoverflow.com/questions/17384218/jquery-input-event
        element.bind('input', function () {
          var preservePos = getCursorPosition(element);
          scope.$apply(function () {
            var value = element.typeahead('val');
            ngModel.$setViewValue(value);
          });
          setCursorPosition(element, preservePos);
        });
      }
    };
  });
