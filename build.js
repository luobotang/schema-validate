const rollup = require('rollup')
const buble = require('@rollup/plugin-buble')
const commonjs = require('@rollup/plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const pkg = require('./package.json')

async function build(output, plugins = []) {
  try {
    const bundle = await rollup.rollup({
      input: 'lib/index.js',
      plugins: [
        buble({
          transforms: {
            dangerousForOf: true
          }
        }),
        commonjs(),
        ...plugins
      ]
    })
    await bundle.write({
      output,
      banner: `/*! ${pkg.name} v${pkg.version} */\n`
    })
  } catch(e) {
    console.log(e)
  }
}

build({
  file: 'index.js',
  format: 'cjs',
  exports: 'named'
})
build({
  file: 'schema-validate.js',
  format: 'iife',
  name: 'SchemaValidate',
  exports: 'named'
})
build({
  file: 'schema-validate.min.js',
  format: 'iife',
  name: 'SchemaValidate',
  exports: 'named'
}, [
  uglify.uglify({
    output: {
      comments: /^!/,
      max_line_len: 1000
    }
  })
])