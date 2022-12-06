const fs = require('fs');
const path = require('path');

const routes = 'routes';
let baseDir,
   base = process.cwd();

let tpl,
   routerTemplate = `<script>
\timport {Route} from "malinajs-router";\n
\timport Home from "./${routes}/+page.xht";
\timport E404 from "./modules/E404.xht";
\t<1>
</script>\n
<Route>
\t<Route path="/">
\t\t<Home/>
\t</>
\t<2>
\t<Route fallback>
\t\t<E404/>
\t</>
</>`;

const routesIndexTemplate = `
<center>
   <h1>
      Homepage
      <p>About homepage</>
   </>
</>
\n<style global>
   *,::before,::after{
      box-sizing:border-box
   }

   *{margin:0}

   body{
      font-family:system-ui;
      line-height:1.5
   }
   
   h1,h2,h3,h4,h5,h6{
      line-height:1.125
   }
   
   :is(h1,h2,h3,h4,h5,h6)>*{
      display: block;
      margin-top: .125em;
      font-size: .5em
   }
</style>
`;

const pageTemplate = `<script>
\texport let params = {};
\tlet slug;\n
\t$:params, slug = params.slug;
</script>\n
<h2> 
\ttitle
\t<sub>Content of title serve on location.</>
</>
<br>
\n
{#if slug}
\t<Slug {slug} />
{/if}
`;

const slugTemplate = `<script>
\texport let slug;\n
\t$:slug, console.log(slug);
</script>\n
<h2>
\ttitle
\t<sub>Content of slug={slug} serve on location.</>
</>
<br>
`;

const e404Template = `<center>
\t<h1>404</>
\t<p>FILE NOT FOUND</>
</>`;

const caps = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function writeFile(filename, content = '') {
   fs.writeFile(filename, content, (err) => {
      if (err) {
         console.error(err);
         exit();
      }
   });
}

function init() {
   tpl = routerTemplate;
   baseDir = base;
   let routes = path.join(baseDir, 'src/routes');
   let modules = path.join(baseDir, 'src/modules');
   let indexFilename = path.join(routes, '+page.xht');
   let e404Filename = path.join(modules, 'E404.xht');

   if (!fs.existsSync(routes)) fs.mkdirSync(routes);
   if (!fs.existsSync(modules)) fs.mkdirSync(modules);

   if (!fs.existsSync(indexFilename))
      writeFile(indexFilename, routesIndexTemplate);

   if (!fs.existsSync(e404Filename)) writeFile(e404Filename, e404Template);

   baseDir = routes;
   traverseDir(baseDir);

   tpl = tpl.replace('<1>', '').replace('<2>', '');
   writeFile(path.join(baseDir, '../Router.xht'), tpl);
}

function traverseDir(dir) {
   fs.readdirSync(dir).forEach((file) => {
      let searchPath = path.join(dir, file);

      if (fs.lstatSync(searchPath).isDirectory()) {
         let indexFilename = path.join(searchPath, '/+page.xht');
         let slugFilename = path.join(searchPath, '/Slug.xht');

         let location = searchPath.replaceAll('\\', '/').split('routes')[1];
         if (!fs.existsSync(indexFilename))
            writeFile(
               indexFilename,
               pageTemplate
                  .replaceAll('title', caps(file))
                  .replaceAll('location', location + '/+page.xht')
            );
         if (!fs.existsSync(slugFilename))
            writeFile(
               slugFilename,
               slugTemplate
                  .replaceAll('title', caps(file))
                  .replaceAll('location', location + '/Slug.xht')
            );

         let cmpPath = searchPath.split(`${routes}`)[1].replace(/\\/g, '/');
         let declaration = `import ${caps(file)} from "./routes${
            (path.join, cmpPath)
         }/+page.xht";\n\t<1>`;
         let routePage = `<Route path="${cmpPath}">\n\t\t<${caps(
            file
         )}/>\n\t</>\n\t<2>`;
         let routeSlug = `<Route path="${cmpPath}/:slug">\n\t\t{#slot params}\n\t\t\t<${caps(
            file
         )} {params}/>\n\t\t{/slot}\n\t</>\n\t<2>`;
         tpl = tpl.replace('<1>', declaration);
         tpl = tpl.replace('<2>', routePage);
         tpl = tpl.replace('<2>', routeSlug);

         traverseDir(searchPath);
      }
   });
}

init();

let watching;

fs.watch(baseDir, { recursive: true }, (ev, f) => {
   if (watching) return;
   watching = true;
   setTimeout(() => {
      if (ev === 'rename' && !f.includes('.')) init();
      watching = false;
   }, 100);
});
