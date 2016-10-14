"use strict";

var module = angular.mock.module;
var inject = angular.mock.inject;

describe('dependencies', function() {
  describe('typeahead.js', function() {
    it('is correctly loaded', inject(function($compile, $rootScope) {
      var elem = $compile('<input type="text">')($rootScope.$new());
      expect(angular.isFunction(elem.typeahead)).toBe(true);
    }));
  });
});

describe('$typeahead', function() {
  beforeEach(module('siyfion.sfTypeahead'));
  it('provides a proxy to the jquery function `typeahead` to let tests hook it',
      inject(function($typeahead) {
    var subject = {
      typeahead: jasmine.createSpy('typeahead')
    };
    $typeahead(subject, 'jasmine', 'test');
    expect(subject.typeahead).toHaveBeenCalledWith('jasmine', 'test');
  }));
});

describe('sfTypeahead', function() {
  beforeEach(module('siyfion.sfTypeahead'));

  var $scope;
  var $element;
  var $typeahead;

  var createScope = function($rootScope) {
    var $scope = $rootScope.$new();
    $scope.datasets = {
      source: jasmine.createSpy('dataset source'),
    };
    $scope.options = {
      highlight: true
    };
    $scope.model = 'simple value';
    return $scope;
  };

  beforeEach(module(function($provide) {
    $typeahead = jasmine.createSpy('typeahead').and.callFake(function(subject) {
      subject.typeahead.apply(subject, Array.prototype.slice.call(arguments, 1));
    });
    $provide.value('$typeahead', $typeahead);
  }));

  describe('Directive syntax', function() {
    it('is compiled on class name', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $element = $compile('<input type="text" class="sf-typeahead" datasets="datasets" ng-model="model"/>')($scope);
      $scope.$digest();
      expect($element.hasClass("tt-input")).toBe(true);
    }));
    it('is compiled on attribute name', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $element = $compile('<input type="text" sf-typeahead datasets="datasets" ng-model="model"/>')($scope);
      $scope.$digest();
      expect($element.hasClass("tt-input")).toBe(true);
    }));
    it('is not compiled on tag name', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $element = $compile('<sf-typeahead />')($scope);
      $scope.$digest();
      expect($element.hasClass("tt-input")).not.toBe(true);
    }));
    it('requires the datasets parameter', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      try {
        $element = $compile('<input type="text" sf-typeahead ng-model="model"/>')($scope);
        $scope.$digest();
        fail('expected an exception');
      } catch(e) {
        expect(e.message).toEqual('The datasets parameter is mandatory!');
        // success
      }
    }));
    it('requires the ng-model parameter', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      try {
        $element = $compile('<input type="text" sf-typeahead datasets="datasets"/>')($scope);
        $scope.$digest();
        fail('expected an exception');
      } catch(e) {
        // success
      }
    }));
    it('forwards `options` to tt', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $element = $compile('<input type="text" sf-typeahead datasets="datasets" options="options" ng-model="model"/>')($scope);
      $scope.$digest();
      expect($typeahead.calls.first().args[1]).toEqual($scope.options);
    }));
  });
  describe('initialize', function() {
    it('recreates the typeahead when options attribute changes',
        inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $element = $compile('<input type="text" sf-typeahead datasets="datasets" options="options" ng-model="model"/>')($scope);
      $scope.$digest();
      $scope.options = {
        highlight: false
      };
      $scope.$digest();
      expect($element.hasClass('tt-input')).toBe(true);
      expect($typeahead).toHaveBeenCalledWith(jasmine.anything(), 'destroy');
      expect($typeahead).toHaveBeenCalledWith(jasmine.anything(), $scope.options, [$scope.datasets]);
      expect($element.val()).toEqual('simple value');
    }));
    it('recreates the typeahead when datasets attribute changes',
        inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $element = $compile('<input type="text" sf-typeahead datasets="datasets" options="options" ng-model="model"/>')($scope);
      $scope.$digest();
      $scope.datasets = {
        source: function() {}
      };
      $scope.$digest();
      expect($element.hasClass('tt-input')).toBe(true);
      expect($typeahead).toHaveBeenCalledWith(jasmine.anything(), 'destroy');
      expect($typeahead).toHaveBeenCalledWith(jasmine.anything(), $scope.options, [$scope.datasets]);
      expect($element.val()).toEqual('simple value');
    }));
    it('recreates the typeahead when datasets array attribute changes',
        inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.datasets = [$scope.datasets];
      $element = $compile('<input type="text" sf-typeahead datasets="datasets" options="options" ng-model="model"/>')($scope);
      $scope.$digest();
      $scope.datasets.push({
        source: function() {}
      });
      $scope.$digest();
      expect($element.hasClass('tt-input')).toBe(true);
      expect($typeahead).toHaveBeenCalledWith(jasmine.anything(), 'destroy');
      expect($typeahead).toHaveBeenCalledWith(jasmine.anything(), $scope.options, $scope.datasets);
      expect($element.val()).toEqual('simple value');
    }));
    it('recreates the typeahead when datasets array becomes a single dataset',
        inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.datasets = [$scope.datasets];
      $element = $compile('<input type="text" sf-typeahead datasets="datasets" options="options" ng-model="model"/>')($scope);
      $scope.$digest();
      $scope.datasets = {
        source: function() {}
      };
      $scope.$digest();
      expect($element.hasClass('tt-input')).toBe(true);
      expect($typeahead).toHaveBeenCalledWith(jasmine.anything(), 'destroy');
      expect($typeahead).toHaveBeenCalledWith(jasmine.anything(), $scope.options, [$scope.datasets]);
      expect($element.val()).toEqual('simple value');
    }));
  });
  describe('model', function() {
    var $typeahead;
    var $replicated;
    beforeEach(inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $element = $compile('<div>' +
        '<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />' +
        '<input id="replicated" type="text" ng-model="model"/>' +
        '</div>')($scope);
        $typeahead = $element.find('#typeahead');
        $replicated = $element.find('#replicated');
      $scope.$digest();
    }));
    it('is shown on initialization', function() {
      $scope.$digest();
      expect($typeahead.val()).toEqual('simple value');
    });
    it('is bound [scope -> UI]', function() {
      expect($typeahead.val()).toEqual('simple value');
      $scope.model = 'other value';
      $scope.$digest();
      expect($typeahead.val()).toEqual('other value');
    });
    it('is bound [UI -> scope]', function() {
      expect($typeahead.val()).toEqual('simple value');
      $typeahead.val('other value').trigger('input');
      expect($scope.model).toEqual('other value');
      expect($replicated.val()).toEqual('other value');
    });
    it('is updated when on typeahead:select', inject(function() {
      $typeahead.val('other value').trigger('typeahead:select', 'other value');
      expect($scope.model).toEqual('other value');
      expect($replicated.val()).toEqual('other value');
    }));
    it('is updated when on typeahead:autocomplete', function() {
      $typeahead.val('other value').trigger('typeahead:autocomplete', 'other value');
      expect($scope.model).toEqual('other value');
      expect($replicated.val()).toEqual('other value');
    });
  });
  describe('formatter', function() {
    it('sets simple string values', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $element = $compile('<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />')($scope);
      $scope.$digest();
      expect($element.val()).toEqual('simple value');
      expect($element.typeahead('val')).toEqual('simple value');
    }));
    it('sets objects with key', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.model = {
        value: 'simple value'
      };
      $element = $compile('<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />')($scope);
      $scope.$digest();
      expect($element.val()).toEqual('simple value');
      expect($element.typeahead('val')).toEqual('simple value');
    }));
    it('sets the empty string for falsy values', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.model = {
        value: false
      };
      $element = $compile('<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />')($scope);
      $scope.$digest();
      expect($element.val()).toEqual('');
      expect($element.typeahead('val')).toEqual('');
    }));
  });
  describe('allowCustom', function() {
    beforeEach(inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.allowCustom = false;
      $element = $compile('<input id="typeahead" type="text" allow-custom="allowCustom" ng-model="model" datasets="datasets" sf-typeahead />')($scope);
      $scope.$digest();
    }));
    it('forbids modification of the model from user input', function() {
      expect($element.val()).toEqual('simple value');
      $element.val('other value').trigger('input');
      expect($scope.model).toEqual('simple value');
    });
    it('can be changed at runtime', function() {
      $scope.allowCustom = true;
      $scope.$digest();
      expect($element.val()).toEqual('simple value');
      $element.val('other value').trigger('input');
      expect($scope.model).toEqual('other value');
    });
  });
  describe('displayKey', function() {
    it('equals "value" by default', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.model = {
        value: 'simple value'
      };
      $element = $compile('<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />')($scope);
      $scope.$digest();
      expect($element.val()).toEqual('simple value');
    }));
    it('can be a function which returns the value', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.model = {
        my_value: 'simple value'
      };
      $scope.datasets.displayKey = function(model) { return model.my_value; };
      spyOn($scope.datasets, 'displayKey').and.callThrough();
      $element = $compile('<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />')($scope);
      $scope.$digest();
      expect($element.val()).toEqual('simple value');
      expect($scope.datasets.displayKey).toHaveBeenCalledWith($scope.model);
    }));
    it('Is an empty string if the key is falsy', inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.model = {
        value: null
      };
      $element = $compile('<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />')($scope);
      $scope.$digest();
      expect($element.val()).toEqual('');
    }));
  });
  describe('object model', function() {
    var $typeahead;
    var $replicated;
    beforeEach(inject(function($rootScope, $compile) {
      $scope = createScope($rootScope);
      $scope.model = {
        my_value: 'simple value'
      };
      $scope.datasets.displayKey = 'my_value';
      $element = $compile('<div>' +
        '<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />' +
        '<input id="replicated" type="text" ng-model="model.my_value"/>' +
        '</div>'
      )($scope);
      $typeahead = $element.find('#typeahead');
      $replicated = $element.find('#replicated');
      $scope.$digest();
    }));
    it('is shown on initialization', function() {
      $scope.$digest();
      expect($typeahead.val()).toEqual('simple value');
    });
    it('is bound [scope -> UI]', function() {
      expect($typeahead.val()).toEqual('simple value');
      $scope.model = {
        my_value: 'other value'
      };
      $scope.$digest();
      expect($typeahead.val()).toEqual('other value');
    });
    it('is bound [UI -> scope] and takes the string value in that case', function() {
      expect($typeahead.val()).toEqual('simple value');
      $typeahead.val('other value').trigger('input');
      expect($scope.model).toEqual('other value');
      expect($replicated.val()).toEqual('');
    });
    it('is updated on typeahead:select', inject(function() {
      $typeahead.val('other value').trigger('typeahead:select', { my_value: 'other value' });
      expect($scope.model).toEqual({ my_value: 'other value' });
      expect($replicated.val()).toEqual('other value');
    }));
    it('is updated on typeahead:autocomplete', function() {
      $typeahead.val('other value').trigger('typeahead:autocomplete', { my_value: 'other value' });
      expect($scope.model).toEqual({ my_value: 'other value' });
      expect($replicated.val()).toEqual('other value');
    });
    it('prevents unintended model updates (#63)',
        function() {
      $typeahead.val('other value').trigger('typeahead:autocomplete', { my_value: 'other value' });
      expect($scope.model).toEqual({ my_value: 'other value' });
      $typeahead.trigger('input');
      expect($scope.model).toEqual({ my_value: 'other value' });
    });
  });
  describe('events', function() {
    var handler;
    beforeEach(inject(function($rootScope, $compile) {
      handler = jasmine.createSpy('event handler');
      $scope = createScope($rootScope);
      $element = $compile('<input id="typeahead" type="text" ng-model="model" datasets="datasets" sf-typeahead />')($scope);
      $scope.$digest();
    }));
    it('forwards typeahead:active', function() {
      $scope.$on('typeahead:active', handler);
      $element.trigger('typeahead:active', 'some value');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:idle', function() {
      $scope.$on('typeahead:idle', handler);
      $element.trigger('typeahead:idle', 'some value');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:open', function() {
      $scope.$on('typeahead:open', handler);
      $element.trigger('typeahead:open');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:close', function() {
      $scope.$on('typeahead:close', handler);
      $element.trigger('typeahead:close', 'some value');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:change', function() {
      $scope.$on('typeahead:change', handler);
      $element.trigger('typeahead:change', 'some value');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:render', function() {
      $scope.$on('typeahead:render', handler);
      $element.trigger('typeahead:render');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:select', function() {
      $scope.$on('typeahead:select', handler);
      $element.trigger('typeahead:select', 'some value');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:autocomplete', function() {
      $scope.$on('typeahead:autocomplete', handler);
      $element.trigger('typeahead:autocomplete', 'some value');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:cursorchange', function() {
      $scope.$on('typeahead:cursorchange', handler);
      $element.trigger('typeahead:cursorchange');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:asyncrequest', function() {
      $scope.$on('typeahead:asyncrequest', handler);
      $element.trigger('typeahead:asyncrequest');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:asynccancel', function() {
      $scope.$on('typeahead:asynccancel', handler);
      $element.trigger('typeahead:asynccancel');
      expect(handler).toHaveBeenCalled();
    });
    it('forwards typeahead:asyncreceive', function() {
      $scope.$on('typeahead:asyncreceive', handler);
      $element.trigger('typeahead:asyncreceive');
      expect(handler).toHaveBeenCalled();
    });
  });
});
