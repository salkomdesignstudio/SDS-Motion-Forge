/* Object/string plugin form: works with postcss-cli (postcss-load-config)
   AND with bundlers like Next.js that walk up to this config when processing
   the library CSS through a symlinked workspace (function-style plugin
   exports break them). */
module.exports = {
  plugins: {
    'postcss-import': {},
    autoprefixer: {}
  }
};
