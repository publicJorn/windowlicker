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

	//= util.js

	//= windowlicker.js

	return windowlicker;

}));