const moment = require('moment-timezone');
const markdownIt = require('markdown-it');
const purifycss = require('purify-css');
const htmlminifier = require('html-minifier');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("site/img");
    eleventyConfig.addPassthroughCopy("site/fonts");
    eleventyConfig.addPassthroughCopy("site/styles.css");
    eleventyConfig.addPassthroughCopy("site/script.js");
    eleventyConfig.addPassthroughCopy("site/sw.js");
    eleventyConfig.addPassthroughCopy("site/site.webmanifest");
    eleventyConfig.addPassthroughCopy("site/browserconfig.xml");
    eleventyConfig.addPassthroughCopy("site/_redirects");

    eleventyConfig.addNunjucksFilter("date", function (date, format = "YYYY-MM-DD") {
        return moment(date).format(format);
    });

    eleventyConfig.addNunjucksFilter("markdown", function(string) {
        const md = new markdownIt();

        return md.render(string);
    });

    eleventyConfig.addTransform('purifycss', async function(content, outputPath) {
        if (outputPath.endsWith(".html")) {
            return new Promise((resolve) => {
                purifycss(content, ['build/styles.css'], {
                    minify: true
                }, (css) => {
                    resolve(content.replace('<link rel="stylesheet" href="/styles.css">', `<style>${css}</style>`));
                });
            });
        };

        return content;
    });

    eleventyConfig.addTransform('htmlminifier', async function (content, outputPath) {
        if (outputPath.endsWith(".html")) {
            return htmlminifier.minify(content, {
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                sortAttributes: true,
                sortClassName: true
            })
        };

        return content;
    });

    return {
        templateFormats: [
            "njk",
            "md",
            "11ty.js"
        ],

        pathPrefix: "/",
        markdownTemplateEngine: "liquid",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        passthroughFileCopy: true,
        dir: {
            input: "site",
            includes: "../includes",
            data: "../data",
            output: "build"
        }
    }
}
