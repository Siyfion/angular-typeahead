angular.module('siyfion.sfTypeahead', [])
  .directive('sfTypeahead', function () {
    return {
      restrict: 'AC',       // Only apply on an attribute or class
      scope: {
        value: '=ngModel',  // The two-way data bound value that is returned by the directive
        options: '=',       // The typeahead configuration options (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options)
        datasets: '='       // The typeahead datasets to use (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets)
      },
      link: function (scope, element) {

        // Create the typeahead on the element
        element.typeahead(scope.options, scope.datasets);

        function updateScope (object, suggestion, dataset) {
          // for some reason $apply will place [Object] into element, this hacks around it
          var preserveVal = element.val();
          scope.$apply(function () {
            scope.value = suggestion;
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

        // Update the value binding when the user manually enters some text
        element.bind('input', function () {
          scope.$apply(function () {
            var value = element.val();
            scope.value = value;
          });
        });
      }
    };
  });

