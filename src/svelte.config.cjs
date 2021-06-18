const preprocess = require('svelte-preprocess')
const path = require('path')

const stylesDir = __dirname + '/styles'
module.exports = {
  preprocess: preprocess({
    typescript: {
      tsconfigFile: path.resolve(__dirname, '../tsconfig.json'),
    },
    stylus: {
      imports: [stylesDir + '/mixins.styl'],
    },
    postcss: true,
  }),
}
