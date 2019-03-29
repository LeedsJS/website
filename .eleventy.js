const moment = require('moment');
const markdownIt = require('markdown-it');
const cheerio = require('cheerio');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("site/img");
    eleventyConfig.addPassthroughCopy("site/styles.css");
    eleventyConfig.addPassthroughCopy("site/script.js");

    eleventyConfig.addNunjucksFilter("objsort", function(obj, key, reverse = false) {
        const newObj = {};

        let sortedKeys = Object.keys(obj)
            .sort((a, b) => {
                return obj[a][key] > obj[b][key];
            })

        if (reverse) {
            sortedKeys = sortedKeys.reverse();
        }
        sortedKeys.forEach((key) => {
            newObj[key] = obj[key];
        });

        return newObj;
    });

     eleventyConfig.addNunjucksFilter("objfirstkey", function (obj) {
        return Object.keys(obj)[0];
     });


    eleventyConfig.addNunjucksFilter("isfutureevent", function (date) {
        return moment().isSameOrBefore(date, 'day');
    });

    eleventyConfig.addNunjucksFilter("ticketsreleased", function (date) {
        return moment().isSameOrAfter(date);
    });

    eleventyConfig.addNunjucksFilter("date", function (date, format = "YYYY-MM-DD") {
        return moment(date).format(format);
    });

    eleventyConfig.addNunjucksFilter("filterobj", function (obj, searchKey, match,) {
        const newObj = {};

        Object.keys(obj).forEach((key) => {
            if (obj[key][searchKey] === match) {
                newObj[key] = obj[key];
            }
        });

        return newObj;
    });

    eleventyConfig.addNunjucksFilter("ispopulatedobject", function(obj) {
        return Object.keys(obj).length > 0;
    });

    eleventyConfig.addNunjucksFilter("markdown", function(string) {
        const md = new markdownIt();

        return md.render(string);
    })

    eleventyConfig.addNunjucksFilter("jsonstringify", function (obj) {
        return JSON.stringify(obj, null, 4);
    });

    eleventyConfig.addNunjucksFilter("setobjproperty", function (obj, key, value) {
        obj[key] = value;

        return obj;
    });

    eleventyConfig.addNunjucksFilter("getfirsttagcontent", function (string) {
        const $ = cheerio(string);

        return $.first().text();
    });

    return {
        templateFormats: [
            "njk",
            "md"
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
