const { copy } = require('esbuild-plugin-copy');
const malinaPlugin = require('./malinaPlugin');

module.exports = {
   outfile: 'public/app.js',
   plugins: [
      malinaPlugin(),
      copy({
         resolveFrom: 'cwd',
         assets: {
            from: ['./static/*'],
            to: ['./public/pages'],
         },
      }),
   ],
};
