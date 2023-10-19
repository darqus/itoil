'use strict';

Object.defineProperty(exports, '__esModule', { value: true, });
exports.viteSingleFile = void 0;
function viteSingleFile() {
  return {
    name: 'vite:singlefile',
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        // Only use this plugin during build
        if (!ctx || !ctx.bundle) {return html;}

        // Get the bundle
        let extraCode = '';
        let jsCode = '';

        for (const [ , value, ] of Object.entries(ctx.bundle)) {
          const o = value;
          const a = value;

          if (o.code) {
            const reScript = new RegExp(`<script type="module"[^>]*?src="/${value.fileName}"[^>]*?></script>`);
            const code = '';

            jsCode = `\n<script type="text/javascript">${o.code.trim()}</script>`;
            html = html.replace(reScript, (_) => code);
          } else if (value.fileName.endsWith('.css')) {
            const reCSS = new RegExp(`\\s*<link rel="stylesheet"[^>]*?href="/${value.fileName}"[^>]*?>`);
            const code = `\n<style type="text/css">${a.source.trim()}</style>`;

            html = html.replace(reCSS, (_) => code);
          } else {
            extraCode += '\n<!-- ASSET NOT INLINED: ' + a.fileName + ' -->\n';
          }
        }

        return html.replace(/<\/body>/, extraCode + jsCode + '\n</body>');
      },
    },
  };
}
exports.viteSingleFile = viteSingleFile;
