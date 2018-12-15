# register-svelte-require

Hacky way to be able to require Svelte HTML files. Useful for tests.

## install

The normal way: `npm install --save-dev register-svelte-require`

## use

In your test file, simply do:

```js
require('register-svelte-require')(require('svelte'))
const MyWidget = require('./MyWidget.html')
const component = new MyWidget()
```

## api

### `register( svelte, [options = { extensions, compile }] )`

* `svelte` - The `require`'d version of Svelte
* `extensions` - A list of filename extension, e.g. `[ '.html' ]`
* `compile` - An object of options, passed to `svelte.compile`

## full example

Suppose you have a component you want to test:

```html
<!-- Box.html -->
<slot>
	<p>default text</p>
</slot>
```

You might create multiple "test scenario" components:

```html
<!-- BoxDefaultTest.html -->
<Box></Box>
<script>
export default {
	components: { Box: './Box.html' }
}
</script>

<!-- BoxCustomSlotTest.html -->
<Box>
	<p>custom text</p>
</Box>
<script>
export default {
	components: { Box: './Box.html' }
}
</script>
```

Then you could write a test like this:

```js
require('register-svelte-require')(require('svelte'))
const { JSDOM } = require('jsdom')
const test = require('tape')

const BoxDefaultTest = require('./BoxDefaultTest.html')
const BoxCustomSlotTest = require('./BoxCustomSlotTest.html')

const { window } = new JSDOM()
global.document = window.document

test('box slots', t => {
	const noSlot = new BoxDefaultTest({ target: global.document.body })
	t.equal(global.document.body.innerHTML, '<p>default text</p>')
	// reset
	document.body.innerHTML = ''
	const withSlot = new BoxCustomSlotTest({ target: global.document.body })
	t.equal(global.document.body.innerHTML, '<p>custom text</p>')
	t.end()
})
```

## license

Published and released under the [Very Open License](http://veryopenlicense.com).
