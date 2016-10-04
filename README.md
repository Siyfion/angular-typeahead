sfTypeahead: A Twitter Typeahead directive
=================

A simple Angular.js directive wrapper around the Twitter Typeahead library.

Getting Started
---------------

How you acquire angular-typeahead is up to you.

Preferred method:
* Install with [Bower][bower]: `$ bower install angular-typeahead`

Other methods:
* Download latest *[angular-typeahead.js][angular-typeahead.js]* or *[angular-typeahead.min.js][angular-typeahead.min.js]*.

**Note:** angular-typeahead.js has dependencies on the following libraries:
* [typeahead.js][typeahead.js] v0.10.x
* [bloodhound.js][typeahead.js] v0.10.x
* [Angular.js][angularjs] v1.2.0+
* [jQuery][jquery] v1.9+

All of which must be loaded before *angular-typeahead.js*.

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
| editable | true | Boolean. If false, the model value does not update as text input is typed but only takes datum values when the input is autocompleted.  |

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
[angular-typeahead.js]: https://raw.github.com/Siyfion/angular-typeahead/master/angular-typeahead.js
[angular-typeahead.min.js]: https://raw.github.com/Siyfion/angular-typeahead/master/angular-typeahead.min.js

<!-- links to third party projects -->
[bower]: http://twitter.github.com/bower/
[jQuery]: http://jquery.com/
[angularjs]: http://angularjs.org/
[typeahead.js]: http://twitter.github.io/typeahead.js/
[plnkr]: http://plnkr.co/edit/cMvm7Z4REuIP69Uk4Tzz?p=preview
[twitter datasets]: https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets
[twitter options]: https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options
