/**
 * This is an example of using windowlicker as a commonJS module
 * In this specific case, browserify is used to build the project
 *
 * NOTE: If you have windowlicker as a node dependency, you can
 * just use: `require(windowlicker)` or `require(windowlicker-ie)`
 */
var windowlicker = require('../../dist/windowlicker');

function echo(str) {
	var
		p = document.createElement('p'),
		t = document.createTextNode(str);

	p.appendChild(t);
	document.getElementsByTagName('body')[0].appendChild(p);
}

windowlicker.when('small', {
	on: function() {
		echo('I am small');
	}
});

windowlicker.when('small', {
	on: function() {
		echo('I just want to tell again how small I am');
	}
});

windowlicker.when('large', {
	on: function() {
		echo('I am large');
	},
	off: function() {
		echo('Noooooooow! You are killing largearrgbl..');
	},
	legacy: true
});

windowlicker.when('large', {
	on: function() {
		echo('You only see me when resizing to large');
	},
	defer: true
});