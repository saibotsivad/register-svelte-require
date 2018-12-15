const fs = require('fs')
const path = require('path')

const getName = (filename, extension) => {
	const base = path.basename(filename).replace(extension, '')
	return base[0].toUpperCase() + base.slice(1)
}

const extensionsToHook = [ '.html' ]

module.exports = (svelte, options) => {
	(options && options.extensions || extensionsToHook)
		.forEach(extension => {
			Object
				.keys(require.cache)
				.filter(file => file.endsWith(extension))
				.forEach(file => {
					delete require.cache[file]
				})

			require.extensions[extension] = (requiredModule, filename) => {
				const { js } = svelte.compile(
					fs.readFileSync(filename, 'utf-8'),
					Object.assign({
						filename,
						name: getName(filename, extension),
						format: 'cjs'
					}, options && options.compile || {}))
				return requiredModule._compile(js.code, filename)
			}
		})
}
