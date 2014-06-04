(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * windowlicker v0.1.1 - For responsive javascript
 * Copyright (c) 2014 Jorn Luiten - https://github.com/publicJorn/windowlicker
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

// Universal Module Definition (https://github.com/umdjs/umd)
;(function (name, context, factory) {
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory();
	}
	else if (typeof define === 'function' && define.amd) {
		define(function() {
			return (context[name] = factory());
		});
	}
	else {
		context[name] = factory();
	}
}('windowlicker', this, function() {

	'use strict';

	/**
	 * Iterate over collection
	 * @param  {mixed}    collection Array or 1 key deep object literal
	 * @param  {Function} fn         Call this function for each. If function returns false the loop will break
	 * @return {void}
	 */
	function each(collection, fn) {
		var
			i = 0,
			l = collection.length,
			cont;
	
		for (; i < l; i++) {
			cont = fn(collection[i], i);
			if (cont === false) {
				break; //allow early exit
			}
		}
	}

	var
		windowlicker,
		currentScreenSize = null,
		isLegacyBrowser = false,
		buffer,
		fnCache = {};
	
	// We use matchMedia to check mediequery support
	// If no media queries are supported or matchMedia is not found, supply the `legacy`
	// option in windowlicker.when() to activate specific code for old browsers
	if(!window.matchMedia || !window.matchMedia('only all').matches) {
		isLegacyBrowser = true;
	}
	
	// addEventListener() is supported from IE9, only with <!doctype html>
	if (!isLegacyBrowser) {
		if (window.addEventListener) {
			window.addEventListener('resize', resizeBuffer, false);
		} else {
			window.attachEvent('onresize', resizeBuffer);
		}
		checkScreenSize(); // Initially set so windowlicker.getScreenSize() can be called
	}
	
	// This object will be exposed @ the bottom
	windowlicker = {
		/**
		 * Register functionality bound to a certain screen size
		 * @param  {string} size    eg. `large` -should match a value set in CSS
		 * @param  {object} options
		 * @param  {function} options.on
		 * @param  {function} [options.off]
		 * @param  {bool} [options.defer]
		 * @param  {bool} [options.legacy]
		 * @return {void}
		 */
		when: function(size, options) {
			var
				slot = new SizeHandler(size, options);
	
			if (!fnCache[size]) {
				fnCache[size] = [slot];
			} else {
				fnCache[size].push(slot);
			}
		}
	};
	
	
	/**
	 * Retrieves the screen size "name" from CSS
	 */
	function checkScreenSize() {
		var
			oldSize = currentScreenSize,
			newSize = window.getComputedStyle(document.body,':before').getPropertyValue('content')
				.replace(/[\"\'']/g, ''); // Remove quotes
	
		// Publish for affected sizes (in case of > 2 sizes, we don't want to touch others)
		if (newSize !== currentScreenSize) {
			currentScreenSize = newSize;
			publish(oldSize);
			publish(newSize);
		}
	}
	
	
	/**
	 * Prevent overflow of resize event
	 * @return {void}
	 */
	function resizeBuffer() {
		if (buffer) {
			clearTimeout(buffer);
		}
		buffer = setTimeout(checkScreenSize, 50);
	}
	
	
	/**
	 * Walk through registered functions and call appropriate functions
	 * @param  {string} oldSize
	 * @param  {string} newSize
	 * @return {void}
	 */
	function publish(size) {
		var callbacks, i, l, operation;
	
		if (fnCache[size]) {
			each(fnCache[size], function(handler) {
				operation = handler.match()? 'on' : 'off';
	
				if (typeof handler[operation] == 'function') {
					handler[operation]();
				}
			});
		}
	}
	
	
	/**
	 * Every `windowlicker.when()` is initialised with a SizeHandler
	 * @param  {string} size
	 * @param  {object} options
	 * @param  {function} options.on
	 * @param  {function} [options.off]
	 * @param  {bool} [options.defer]
	 * @param  {bool} [options.legacy]
	 * @return {void}
	 */
	function SizeHandler(size, options) {
		this.size = size;
		this.on = options.on;
		if (options.off) this.off = options.off;
	
		var self = this;
		this.match = function() {
			return self.size == currentScreenSize;
		}
	
		// Run immediately?
		if (isLegacyBrowser && options.legacy) {
			this.on();
		} else
		if (!options.defer && this.match()) {
			this.on();
		}
	}

	return windowlicker;

}));
},{}],2:[function(require,module,exports){
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
},{"../../dist/windowlicker":1}]},{},[2])