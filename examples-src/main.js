/**
 * This is an example of using windowlicker as a commonJS module
 * In this specific case, browserify is used to build the project
 *
 * NOTE: If you have windowlicker as a node dependency, you can
 * just use: `require(windowlicker)` or `require(windowlicker-ie)`
 */
var windowlicker = require('../src/windowlicker');

windowlicker.when('large', {
	on: function() {
		console.log('I am large');
	},
	off: function() {
		console.log('Noooooooow! You are killing largearrgbl..');
	},
	legacy: true
});

windowlicker.when('large', {
	on: function() {
		console.log('You only see me when resizing to large');
	},
	defer: true
});

windowlicker.when('small', {
	on: function() {
		console.log('I am small');
	}
});

windowlicker.when('small', {
	on: function() {
		console.log('I just want to tell again how small I am');
	}
});
