(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    factory();
  }
}(this, function () {

"use strict";
angular.module('siyfion.sfTypeahead', [])
  .value('$typeahead', function(subject) {
    subject.typeahead.apply(subject, Array.prototype.slice.call(arguments, 1));
  })
  .directive('sfTypeahead', ['$typeahead', function ($typeahead) {

  return {
    restrict: 'AC',       // Only apply on an attribute or class
    require: 'ngModel',   // The two-way data bound value that is returned by the directive
    scope: {
      datasets: '=',
      options: '=',
      editable: '='   // cannot use '<' if we want to support angular 1.2.x
    },
    link: function(scope, element, attrs, ngModel) {
      var initialized = false;
      var options;
      var datasets;
      var unsubscribe = null;
      var datasetsIsArray;

      // Create the typeahead on the element
      initialize();

      watchScope();

      // Parses and validates what is going to be set to model (called when: ngModel.$setViewValue(value))
      ngModel.$parsers.push(function(fromView) {
        // In Firefox, when the typeahead field loses focus, it fires an extra
        // angular input update event.  This causes the stored model to be
        // replaced with the search string.  If the typeahead search string
        // hasn't changed at all (the 'val' property doesn't update until
        // after the event loop finishes), then we can bail out early and keep
        // the current model value.
        if (angular.isObject(ngModel.$modelValue) && fromView === getModelValue(ngModel.$modelValue)) {
          return ngModel.$modelValue;
        }

        if (!isEditable() && typeof fromView === 'string') {
          return ngModel.$modelValue;
        }

        return fromView;
      });

      // Formats what is going to be displayed (called when: $scope.model = { object })
      ngModel.$formatters.push(function(fromModel) {
        if (angular.isObject(fromModel)) {
          fromModel = getModelValue(fromModel);
        }

        if (!fromModel) {
          $typeahead(element, 'val', '');
        } else {
          $typeahead(element, 'val', fromModel);
        }
        return fromModel;
      });

      function watchScope() {
        unsubscribe = datasetsIsArray ?
            scope.$watchCollection('datasets', watchHandler) :
            scope.$watch('datasets', watchHandler);
      }

      function watchHandler(newValue, oldValue) {
        if (angular.equals(newValue, oldValue)) {
          return;
        }
        var oldDatasetsIsArray = datasetsIsArray;
        initialize();
        if (datasetsIsArray !== oldDatasetsIsArray) {
          unsubscribe();
          watchScope();
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
          initialized = true;
        } else {
          var value = element.val();
          $typeahead(element, 'destroy');
          $typeahead(element, options, datasets);
          ngModel.$setViewValue(value);
        }
      }

      function getModelValue(model) {
        for (var i in datasets) {
          var dataset = datasets[i];
          var displayKey = dataset.displayKey || 'value';
          var value = (angular.isFunction(displayKey) ? displayKey(model) : model[displayKey]) || '';
          return value;
        }
      }

      function isEditable() {
        return scope.editable === undefined || !!scope.editable;
      }

      function updateScope (suggestion) {
        scope.$apply(function () {
          ngModel.$setViewValue(suggestion);
        });
      }

      // Update the value binding when a value is manually selected from the dropdown.
      element.bind('typeahead:selected', function(evt, suggestion, dataset) {
        updateScope(suggestion);
        scope.$emit('typeahead:selected', suggestion, dataset);
      });

      // Update the value binding when a query is autocompleted.
      element.bind('typeahead:autocompleted', function(evt, suggestion, dataset) {
        updateScope(suggestion);
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

      // Propagate the asyncrequest event
      element.bind('typeahead:asyncrequest', function() {
        scope.$emit('typeahead:asyncrequest');
      });

      // Propagate the asynccancel event
      element.bind('typeahead:asynccancel', function() {
        scope.$emit('typeahead:asynccancel');
      });

      // Propagate the asyncreceive event
      element.bind('typeahead:asyncreceive', function() {
        scope.$emit('typeahead:asyncreceive');
      });

      // Propagate the render event
      element.bind('typeahead:render', function() {
        scope.$emit('typeahead:render');
      });

      // Propagate the cursorchanged event
      element.bind('typeahead:cursorchanged', function(event, suggestion, dataset) {
        scope.$emit('typeahead:cursorchanged', event, suggestion, dataset);
      });
    }
  };
}]);


}));
