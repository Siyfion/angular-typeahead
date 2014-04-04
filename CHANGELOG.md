# CHANGELOG

## v0.1.3
* Adds 'editable' option, to only allow model values from datum objects. (Thanks to @raphahardt)

## v0.1.2
* Retains cursor position, thanks to @skakri.

## v0.1.1
* Adds event propagation for all the other typeahead.js events.

## v0.1.0
* This is a **BREAKING CHANGE** release.
* Major new release that adds initial support for the new Twitter Typeahead v0.10.x release.
* As a direct result of Twitter's changes, two-way binding is no longer possible at this time (the directive cannot access any local datum lists & never could access remote lists).
* You can now update local datasets using [`Bloodhound#add`](https://github.com/twitter/typeahead.js/blob/master/src/bloodhound/bloodhound.js#L151) and I have questioned whether a similar method could be added for datum removal.

## v0.0.12
* Merged in Jakob Lahmer's changes, which ensures that the typeahead events are propagated to the scope.

## v0.0.11
* Merged in slobo's changes, including a refactoring of the event methods and a slight hack around the [object Object] issue.

## v0.0.10
* Reverting previous change in v0.0.9 (return the datum object, not the string!)

## v0.0.9
* Added type check to the datum object, in-case the datum is a string that is implicitly converted.

## v0.0.8
* Bugfix for issue #10
* The fix should also support datums with non-default value keys.

## v0.0.7
* Now updates the ngModel with the raw user input.
* Optimization on the ngModel watch.

## v0.0.6
* Merged in @jmaynier's PR for supporting multiple datasets. (Thanks!)

## v0.0.5
* Renamed the angular module to `siyfion.sfTypeahead`.
* Renamed the angular directive to `sfTypeahead`.
* Added two-way binding support to ng-model.

## v0.0.4
* Added one-way binding support to ng-model.