/**
 * Provides functions for working with responsiveness.
 * Your module can subscribe to the "windowResized" event, or ask for the current screensize directly.
 *
 * ADD TO CSS:
 * In order for this functionality to work, you need to add this to your css:
 *
 * --- start: plain css example ---
// For util/responsive.js
body:after {
	display: none;
	content: 'small';
	@media (min-width:1024px) {
		content: 'large';
	}
}
 * --- end ---
 *
 * @author  https://github.com/publicJorn
 * @version 0.3
 */
var responsiveScript = (function() {
	// --- MATCHMEDIA.js | extracted
	/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */
	var styleMedia = (window.styleMedia || window.media);

	// For those that don't support matchMedium
	if (!styleMedia) {
		var style = document.createElement('style'),
		script = document.getElementsByTagName('script')[0],
		info = null;

		style.type = 'text/css';
		style.id = 'matchmediajs-test';

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
	// ---

	// START RESPONSIVE SCRIPT ---

	// Exit if no media queries (supported from IE9)
	if(!styleMedia.matchMedium('only all')) {
		return;
	}


	var
		publishFunction = null,
		currentScreenSize = null, // eg. 'large', 'small', etc.
		cache = {}; // eg.
		// {
		// 	'large': [
		// 		callback1,
		// 		callback2
		// 	], ...
		// }

	// addEventListener() is supported from IE9
	window.addEventListener('resize', calculateScreenSize, false);
	calculateScreenSize();


	/**
	 * Returns the label of the current screen size
	 * @return {string} Label as defined in "sizes" array
	 */
	function calculateScreenSize() {
		var size = window.getComputedStyle(document.body,':after').getPropertyValue('content')
			.replace(/[\"\'']/g, ''); // Remove quotes

		if (size !== currentScreenSize) {
			currentScreenSize = size;
			publish();
		}
	}


	/**
	 * Publis
	 * @return {[type]} [description]
	 */
	function publish() {
//		if (publishFunction) {
//			publishFunction.call(window, 'responsiveScript', currentScreenSize);
//		} else {
			if (cache[currentScreenSize]) {
				var callbacks = cache[currentScreenSize];

				for (var i = 0, l = callbacks.length; i < l; i++) {
					callbacks[i].call(window, currentScreenSize);
				}
			}
//		}
	}


	return {
		/**
		 * Use custom notify method
		 * Should be called with 1 argument
		 *
		 * hints:
		 * - jquery: `$.fn.trigger`
		 * - or some custom pub/sub implementation
		 *
		 * @param  {string} size When window reaches this size, run callback
		 * @return {void}
		 */
//		notifyFn: function(fn) {
//			publishFunction = fn;
//		},

		/**
		 * When changing to this size, call callback function
		 *
		 * @param  {string}   size     If window becomes this size,
		 * @param  {Function} callback call this function
		 * @param  {bool}     call_now Call immediately, if currentScreenSize equals size
		 * @return {void}
		 */
		on: function(size, callback, call_now) {
			if (!cache[size]) {
				cache[size] = [callback];
			} else {
				cache[size].push(callback);
			}

			if (call_now) {
				callback.call(window, currentScreenSize);
			}
		},

		getScreenSize: function() {
			return currentScreenSize;
		}
	}
})();
