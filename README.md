# windowlicker

Gateway to responsive javascript (named after an awesome song by Aphrodite).

When creating responsive web pages, we use media queries to make our page look different depending on available screen size.

Our javascript often also needs to know about the current state of the page, in order to properly initialise, display or animate content.

WindowLicker offers a sollution that builds on these principles:

- Small screens first (avoiding buzzwords here) ;)
- Sizes are given in a single place. This should be in CSS
- Legacy browsers should fall back to rendering the desktop- or large version

## Examples

In the example folder the following use case is shown, but using 3 different builds of this script (read more about builds below).

### CSS

Set available sizes in css:

    body::before {
    	position: absolute;
    	left: -99999px;
    	visibility: hidden;
    }

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

### See the examples live

Feel free to download the source and play around. Any suggestions? Please file an issue/pull-request

- fork, clone or download the source
- `npm install`
- `grunt`
- open `localhost:9000` in your browser

## Different builds

Choose the build that suits your needs:

### Standalone - Only modern browsers (IE >= 10)

- 1 file: `windowlicker.js`
- Uses native window.matchMedia and window.addEventListener

### Standalone - Support for IE9 and partial IE8

- 1 file: `windowlicker-ie.js`
- Uses some polyfills
- IE8 and older will default to largest screen size (set on init)
- Filesize is increased by ~x Kb

### As node module

- Use windowlicker in your own buildprocess
- Support for: browserify (requirejs is coming...)
- Complete control over optimization; have a look at the source code to see current build options (I'm using grunt)
