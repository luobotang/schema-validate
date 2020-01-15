const rollup = require('rollup')
const buble = require('@rollup/plugin-buble')
const commonjs = require('@rollup/plugin-commonjs')
const pkg = require('./package.json')

async function build(output) {
  try {
    const bundle = await rollup.rollup({
      input: 'lib/index.js',
      plugins: [
        buble({
          transforms: {
            dangerousForOf: true
          }
        }),
        commonjs()
      ]
    })
    await bundle.write({
      output,
      banner: `/* ${pkg.name} v${pkg.version} */\n`
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