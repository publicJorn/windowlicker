/*global sjaak, jQuery */
/**
 * Provides functions for working with responsiveness.
 * Your module can subscribe to the "windowResized" event, or ask for the current screensize directly.
 *
 * ADD TO CSS:
 * In order for this functionality to work, you need to add this to your css:
 *
 * --- start: sass/compass example using the mq() mixin ---
// For util/responsive.js
body:after {
  display: none;
  content: 'small';
  @include mq('l') {
    content: 'large';
  }
}
 * -- end ---
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
 * EXAMPLES FOR IN YOUR MODULE:
 * this.request('responsive').screenSize(); // Directly
 * this.subscribe('windowResized', $.proxy(this.<function>, this)); // Subscribe
 *
 * @author  jorn@info.nl
 * @version 2.0
 * @tested IE9+ and modern browsers
 */
(function(util, $, undefined) {
  util.responsive = {
    /**
     * Run on pageload
     * @return {[type]} [description]
     */
    init: function() {
      if (Modernizr && Modernizr.mq('only all') && typeof window.getComputedStyle !== 'undefined') {
        util.request('$window').on('resize', calculateScreenSize);
        calculateScreenSize(); // Run once on pageload
      }
    },

    /**
     * Execute private function -this way screenSize can be acessed as a property
     */
    getScreenSize: getScreenSize
  };

  // ------------------------------- PRIVATE FUNCTIONS --------------------------------
  var currentScreenSize = null;

  /**
   * Returns the label of the current screen size
   * @return {string} Label as defined in "sizes" array
   */
  function calculateScreenSize() {
    var size = window.getComputedStyle(document.body,':after').getPropertyValue('content')
      .replace(/[\"\'']/g, ''); // Remove quotes

    if (size !== currentScreenSize) {
      currentScreenSize = size;
      util.publish('windowSlotChanged', getScreenSize.call());
    }
  }

  /**
   * Returns the current screensize as object
   * @return {[type]} [description]
   */
  function getScreenSize() {
    return {
      size: currentScreenSize
    };
  }
})(sjaak.util = sjaak.util || {}, jQuery);