var
	currentScreenSize = null,
	isLegacyBrowser = false,
	buffer,
	fnCache = {};

// We use matchMedia to check mediequery support
// For IE9 use matchMedia. If no media queries are supported or matchMedia is not found,
// supply the `legacy` option in windowlicker.when() to activate code for old browsers
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


// Expose windowlicker
module.exports = {
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


// --- UTIL ---

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