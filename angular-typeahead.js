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

        // Flag if user is selecting or not
        var selecting = false;

        // Create the typeahead on the element
        element.typeahead(scope.options, scope.datasets);

        // Parses what is going to be set to model
        ngModel.$parsers.push(function (fromView) {
          if (((_ref = scope.options) != null ? _ref.editable : void 0) === false) {
            ngModel.$setValidity('typeahead', !selecting);
            if (selecting) {
              return undefined;
            }
          }
          return fromView;
        });

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
          // for some reason $apply will place [Object] into element, this hacks around it
          var preserveVal = element.val();
          scope.$apply(function () {
            selecting = false;
            ngModel.$setViewValue(suggestion);
          });
          element.val(preserveVal);
        }

        // Update the value binding when a value is manually selected from the dropdown.
        element.bind('typeahead:selected', function(object, suggestion, dataset) {
          updateScope(object, suggestion, dataset);
          scope.$emit('typeahead:selected');
        });

        // Update the value binding when a query is autocompleted.
        element.bind('typeahead:autocompleted', function(object, suggestion, dataset) {
          updateScope(object, suggestion, dataset);
          scope.$emit('typeahead:autocompleted');
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
        element.bind('input', function () {
          var preservePos = getCursorPosition(element);
          scope.$apply(function () {
            var value = element.val();
            selecting = true;
            ngModel.$setViewValue(value);
          });
          setCursorPosition(element, preservePos);
        });
      }
    };
  });
