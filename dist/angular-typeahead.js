(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('angular-typeahead', ["angular"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("angular"),require("typeahead.js"));
  } else {
    factory(angular);
  }
}(this, function (angular) {

"use strict";
angular.module('siyfion.sfTypeahead', [])

// Inject the typeahead jquery plugin through angular to make it easier to unit
// test the library.
// Usage:
//  instead of `$element.typeahead(foo, bar)`
//  do `$typeahead($element, foo, bar)`
.value('$typeahead', function(subject) {
  subject.typeahead.apply(subject, Array.prototype.slice.call(arguments, 1));
})

// The actual directive
.directive('sfTypeahead', ['$typeahead', function ($typeahead) {

  return {
    restrict: 'AC',       // Only apply on an attribute or class
    require: 'ngModel',   // The two-way data bound value that is returned by the directive
    scope: {
      datasets: '=',
      options: '=',
      allowCustom: '='   // We cannot use '<' if we want to support angular 1.2.x
    },
    link: function(scope, element, attrs, ngModel) {
      var initialized = false;
      var options;
      var datasets;
      // Unsubscribe handle for the scope watcher
      var unsubscribe = null;
      // Remembers whether the `datasets` parameter provided was an array or an object.
      var datasetsIsArray;

      // Create the typeahead on the element
      initialize();

      // Watch for changes on datasets
      watchDatasets();

      // Parses and validates what is going to be set to model (called when: ngModel.$setViewValue(value))
      ngModel.$parsers.push(function(fromView) {
        // In Firefox, when the typeahead field loses focus, it fires an extra
        // angular input update event.  This causes the stored model to be
        // replaced with the search string.  If the typeahead search string
        // hasn't changed at all (the 'val' property doesn't update until
        // after the event loop finishes), then we can bail out early and keep
        // the current model value.
        if (angular.isObject(ngModel.$modelValue) && fromView === getDatumValue(ngModel.$modelValue)) {
          return ngModel.$modelValue;
        }

        if (!isCustomAllowed() && typeof fromView === 'string') {
          return ngModel.$modelValue;
        }

        return fromView;
      });

      // Formats what is going to be displayed (called when: $scope.model = { object })
      ngModel.$formatters.push(function(fromModel) {
        if (angular.isObject(fromModel)) {
          fromModel = getDatumValue(fromModel);
        }

        if (!fromModel) {
          $typeahead(element, 'val', '');
        } else {
          $typeahead(element, 'val', fromModel);
        }
        return fromModel;
      });

      function watchDatasets() {
        unsubscribe = datasetsIsArray ?
            scope.$watchCollection('datasets', datasetsChangeHandler) :
            scope.$watch('datasets', datasetsChangeHandler);
      }

      function datasetsChangeHandler(newValue, oldValue) {
        if (angular.equals(newValue, oldValue)) {
          return;
        }
        var oldDatasetsIsArray = datasetsIsArray;
        initialize();
        if (datasetsIsArray !== oldDatasetsIsArray) {
          unsubscribe();
          watchDatasets();
        }
      }

      function initialize() {
        if (scope.datasets == null) {
          throw new Error('The datasets parameter is mandatory!');
        }

        options = scope.options || {};
        datasetsIsArray = angular.isArray(scope.datasets);
        datasets = datasetsIsArray ? scope.datasets : [scope.datasets];

        if (!initialized) {
          $typeahead(element, options, datasets);
          scope.$watch('options', initialize);
          initialized = true;
        } else {
          $typeahead(element, 'destroy');
          $typeahead(element, options, datasets);
        }
      }

      // Returns the string to be displayed given some datum
      function getDatumValue(datum) {
        for (var i in datasets) {
          var dataset = datasets[i];
          var displayKey = dataset.displayKey || 'value';
          var value = (angular.isFunction(displayKey) ? displayKey(datum) : datum[displayKey]) || '';
          return value;
        }
      }

      function isCustomAllowed() {
        return scope.allowCustom === undefined || !!scope.allowCustom;
      }

      function updateScope (suggestion) {
        scope.$apply(function () {
          ngModel.$setViewValue(suggestion);
        });
      }

      function forwardEvent(name) {
        element.bind(name, function() {
          scope.$emit(name, Array.prototype.slice. call(arguments, 1));
        });
      }

      // Update the value binding when a value is manually selected from the dropdown.
      element.bind('typeahead:select', function(evt, suggestion, dataset) {
        updateScope(suggestion);
        scope.$emit('typeahead:select', suggestion, dataset);
      });

      // Update the value binding when a query is autocompleted.
      element.bind('typeahead:autocomplete', function(evt, suggestion, dataset) {
        updateScope(suggestion);
        scope.$emit('typeahead:autocomplete', suggestion, dataset);
      });

      forwardEvent('typeahead:active');
      forwardEvent('typeahead:idle');
      forwardEvent('typeahead:open');
      forwardEvent('typeahead:close');
      forwardEvent('typeahead:change');
      forwardEvent('typeahead:render');
      forwardEvent('typeahead:cursorchange');
      forwardEvent('typeahead:asyncrequest');
      forwardEvent('typeahead:asynccancel');
      forwardEvent('typeahead:asyncreceive');
    }
  };
}]);


}));
