const rollup = require('rollup')
const buble = require('@rollup/plugin-buble')
const commonjs = require('@rollup/plugin-commonjs')
const pkg = require('./package.json')

async function build(output) {
  const bundle = await rollup.rollup({
    input: 'lib/index.js',
    plugins: [
      buble(),
      commonjs()
    ]
  })
  await bundle.write({
    output,
    banner: `/* ${pkg.name} v${pkg.version} */\n`
  })
}

build({
  file: 'index.js',
  format: 'cjs'
})
build({
  file: 'schema-validate.js',
  format: 'iife',
  name: 'SchemaValidate'
})