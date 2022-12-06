const fs = require('fs');
const path = require('path');
const sassPlugin = require('malinajs/plugins/sass.js');

const watch = process.argv.includes('-w') ? (process.env.WATCH = 1) : null;

if (watch) require('./routes');

module.exports = function (option, filename) {
   const dirname = filename.replace(/[^\\\/]+$/, '');
   option.hideLabel = true;
   option.css = false;
   option.passClass = false;
   option.immutable = true;
   option.plugins = [sassPlugin()];
   option.autoimport = (name) => {
      const lists = [
         `${name}.xht`,
         `components/${name}.xht`,
         `modules/${name}.xht`,
      ];

      let found = '';

      for (let j = 0; j < lists.length; j++) {
         let list = lists[j];
         let prefix = '';
         let search = './' + list;
         for (let i = 0; i < 7; i++) {
            let target = path.join(dirname, search);
            if (fs.existsSync(target)) {
               found = `import ${name} from '${search}';`;
               break;
            }
            prefix += '../';
            search = prefix + list;
         }
         if (found) break;
      }
      return found;
   };

   return option;
};
