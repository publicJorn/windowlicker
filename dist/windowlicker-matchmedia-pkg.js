/*!
 * windowlicker v0.1.2 - For responsive javascript
 * Copyright (c) 2014 Jorn Luiten - https://github.com/publicJorn/windowlicker
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());
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