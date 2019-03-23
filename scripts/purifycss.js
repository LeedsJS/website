const purifycss = require('purify-css');
const find = require('find');
const fs = require('fs');

find.file(/\.html$/, 'build/', htmlFiles => {
    htmlFiles.forEach(filename => {
        purifycss([filename], ['build/styles.css'], {
            minify: true
        }, (css) => {
            let html = fs.readFileSync(filename, 'utf8');
            html = html.replace('<link rel="stylesheet" href="/styles.css">', `<style>${css}</style>`);
            fs.writeFileSync(filename, html);
        })
    });
});
