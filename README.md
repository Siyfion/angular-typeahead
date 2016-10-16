sfTypeahead: A Twitter Typeahead directive
=================

[![Build Status](https://travis-ci.org/Siyfion/angular-typeahead.svg?branch=master)](https://travis-ci.org/Siyfion/angular-typeahead)
![Coverage: 100%](https://cdn.rawgit.com/Siyfion/angular-typeahead/master/resources/coverage.svg)
[![Version](https://badge.fury.io/gh/Siyfion%2Fangular-typeahead.svg)](https://badge.fury.io/gh/Siyfion%2Fangular-typeahead)
[![dependencies Status](https://david-dm.org/Siyfion/angular-typeahead/status.svg)](https://david-dm.org/Siyfion/angular-typeahead)

A simple Angular.js directive wrapper around the Twitter Typeahead library.

Getting Started
---------------

Get angular-typeahead from your favorite source:

* Install with [Bower][bower]: `$ bower install angular-typeahead`
* Install with [npm][npm]: `$ npm install angular-typeahead`
* Download latest *[angular-typeahead.js][angular-typeahead.js]* or *[angular-typeahead.min.js][angular-typeahead.min.js]*.

**Note:** angular-typeahead supports [Angular.js][angularjs] v1.2.x through v1.5.x and depends on [typeahead.js][typeahead.js] v0.11.x. Make sure dependencies are met in your setup:

* **global**: include jQuery, angularjs and typeahead.js before *angular-typeahead.js*.
* **commonJS** (node, browserify): angular-typeahead explicitly *requires* `angular` and `typeahead.js`. (note: with browserify, include jquery.js and typeahead.js externally, because angular does not define a dependency on jquery)
* **amd** (require.js): angular-typeahead explicitly *requires* `angular` and declares itself as `angular-typeahead`. Note that `typeahead.js` does not work well with AMD.js, you may find [this workaround](https://github.com/twitter/typeahead.js/issues/1211#issuecomment-129189829) useful.

Demo
---------------

Please feel free to play with the Plnkr: [LIVE DEMO][plnkr]

Usage
---------------

```html
<input type="text" datasets="datasets" options="options" ng-model="model" editable="editable" sf-typeahead />
```

See the Plnkr [LIVE DEMO][plnkr] for a complete integrated example.

### Parameters

| Parameter | Default | Description |
|---------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| datasets | {} | One or an array of twitter typeahead [datasets][twitter datasets].  |
| options | {} | [Options][twitter options] parameter passed directly to twitter typeahead.  |
| allow-custom | true | Boolean. If false, the model value can not take custom values as text is typed in the input field.  |

Contributing
---------------

Please feel free to add any issues to the GitHub issue tracker.

Contributions are welcome but please try to adhere to the folowing guidelines:

### Testing

Any code you write should be tested. Test the "happy path" as well as corner cases.
Code cannot be merged in master unless it achieves 100% coverage on everything.
To run tests automatically when a file changes, run `npm run watch`.

Tests run in Chrome by default, but you can override this by setting the `KARMA_BROWSER`
environment variable.
Example:
```sh
KARMA_BROWSER=Firefox npm run watch
KARMA_BROWSER=PhantomJS npm run watch
```

If you are not sure how to test something, ask about it in your pull request description.

### JSHint

I recommend you use a jshint plugin in your editor, this will help you spot errors
faster and make it easier to write clean code that is going to pass QA.
In any case, `npm run watch` runs jshint on the code whenever you save.


<!-- assets -->
[angular-typeahead.js]: https://raw.github.com/Siyfion/angular-typeahead/master/dist/angular-typeahead.js
[angular-typeahead.min.js]: https://raw.github.com/Siyfion/angular-typeahead/master/dist/angular-typeahead.min.js

<!-- links to third party projects -->
[bower]: http://twitter.github.com/bower/
[npm]: https://www.npmjs.com/
[jQuery]: http://jquery.com/
[angularjs]: http://angularjs.org/
[typeahead.js]: http://twitter.github.io/typeahead.js/
[plnkr]: http://plnkr.co/edit/k2JWu6tZMXwkB8Oi9CSv?p=preview
[twitter datasets]: https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets
[twitter options]: https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options
