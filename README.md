# windowlicker

For responsive javascript

When creating responsive web pages, we use media queries to make our page look different depending on available screen size.

Our javascript often also needs to know about the current state of the page, in order to properly initialize, display or animate content.

WindowLicker offers a solution using these principles:

- Small screens first (avoiding buzzwords here) ;)
- Sizes are given in a single place. This should be in CSS
- Legacy browsers should fall back to rendering the desktop- or large version

## How to...

Windowlicker supports commonJS, AMD and can work on it's own (in script tag). It reads the proper size from css on window resize and your functionality hooks into this, following the pub/sub pattern. Have a look:

### CSS

Set available sizes in css:

	body::before {
    	position: absolute;
    	left: -99999px;
    	visibility: hidden;
    }

	/* add as many sizes as you want */
    @media screen and (min-width: 0px) {
    	body::before {
    		content: 'small';
    	}
    }
    @media screen and (min-width: 600px) {
    	body::before {
    		content: 'large';
    	}
    }

**Javascript**

Hook into these sizes in javascript:

    windowlicker.when('small', {
    	on: function() {
    		// run when small
    	},
    	off: function() {
    		// run when small no more
    	},
    	defer: true, // default false. Wait executing code until the screen changes to this size
    	legacy: true // legacy browsers should always init the code in "on()"
    });

### Play around with it yourself

Feel free to download the source and play around. Any suggestions? Please file an issue/pull-request

- fork, clone or download the source
- `npm install`
- `grunt`
- open `functional-test/browserify.html` in your browser. For development I'm just making use of this file. If you want to run the stand alone version, run `grunt release` first.

## Different builds

Choose the build that suits your needs:

### As node module

- Include in your project `npm install windowlicker --save` (--save includes it in your package.json's dependencies)
- `var windowlicker = require('windowlicker');`

### Standalone

- You may want to download windowlicker and include it in a script tag (or some other way)
- [minified](https://raw.githubusercontent.com/publicJorn/windowlicker/master/dist/windowlicker.min.js) (1.24Kb or 343b gzipped)
- [development version](https://raw.githubusercontent.com/publicJorn/windowlicker/master/dist/windowlicker.js)

### Standalone with matchMedia polyfill baked in!

In case you don't want to polyfill yourself!

- 1 file: `windowlicker-matchmedia-pkg.js`
- Uses matchMedia polyfill
- IE8 and older will default to largest screen size (set on init)
- [minified](https://raw.githubusercontent.com/publicJorn/windowlicker/master/dist/windowlicker.min.js) (1.83Kb or 487b gzipped)
- [development version](https://raw.githubusercontent.com/publicJorn/windowlicker/master/dist/windowlicker.js)

## What's in a name?
Why windowlicker?

Well.. we are working with the window and when naming this thing I just happened to listen to [Window Licker by Aphex Twin](http://open.spotify.com/track/60Pe9j2pCBa4Zp4ztf5nhd). True story ;)
