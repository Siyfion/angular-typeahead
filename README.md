sfTypeahead: A Twitter Typeahead directive
=================

A simple Angular.js directive wrapper around the Twitter Typeahead library.

License: [MIT](http://www.opensource.org/licenses/mit-license.php)

Getting Started
---------------

How you acquire angular-typeahead is up to you.

Preferred method:
* Install with [Bower][bower]: `$ bower install angular-typeahead`

Other methods:
* Download latest *[angular-typeahead.js][angular-typeahead.js]* or *[angular-typeahead.min.js][angular-typeahead.min.js]*.

**Note:** angular-typeahead.js has dependencies on the following libraries:
* [typeahead.js][typeahead.js]
* [Angular.js][angularjs]
* [jQuery][jquery] 1.9+

All of which must be loaded before *angular-typeahead.js*.

Demo
---------------

Please feel free to play with the Plnkr: [LIVE DEMO][plnkr]

Usage
---------------

The bare bones:

```html
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="typeahead.js"></script>
<script type="text/javascript" src="angular.js"></script>
<script type="text/javascript" src="angular-typeahead.js"></script>
<script>
  // Create the application and import the siyfion.sfTypeahead dependency.
  angular.module('myApp', ['siyfion.sfTypeahead']);
</script>
<body ng-app="myApp">
    <input type="text" class="sfTypeahead" datasets="exampleData" ng-model="foo"></div>
<body>
```

```javascript
// Define your own controller somewhere...
function MyCtrl($scope) {

  // single dataset
  $scope.exampleData = {
    name: 'accounts',
    local: ['timtrueman', 'JakeHarding', 'vskarich']
  };

  $scope.multiExample = [
    {
      name: 'accounts',
      prefetch: 'https://twitter.com/network.json',
      remote: 'https://twitter.com/accounts?q=%QUERY'
    },
    {
      name: 'trends',
      prefetch: 'https://twitter.com/trends.json'
    }
  ];

  $scope.foo = null;
};
```


<!-- assets -->
[angular-typeahead.js]: https://raw.github.com/Siyfion/angular-typeahead/master/angular-typeahead.js
[angular-typeahead.min.js]: https://raw.github.com/Siyfion/angular-typeahead/master/angular-typeahead.min.js

<!-- links to third party projects -->
[bower]: http://twitter.github.com/bower/
[jQuery]: http://jquery.com/
[angularjs]: http://angularjs.org/
[typeahead.js]: http://twitter.github.io/typeahead.js/
[plnkr]: http://plnkr.co/edit/AT2RhpE4Qhj4iN5qMtdi?p=preview
