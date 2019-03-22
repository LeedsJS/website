module.exports = function(eleventyConfig) {
    const moment = require('moment');
    const markdownIt = require('markdown-it');

    eleventyConfig.addPassthroughCopy("_site/img");
    eleventyConfig.addPassthroughCopy("_site/styles.css");
    eleventyConfig.addPassthroughCopy("_site/script.js");

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
        const releaseDate = moment(date).subtract(7, 'days').hour(9).minute(30);
        return moment().isSameOrAfter(releaseDate);
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
            input: "_site",
            includes: "../_includes",
            data: "../_data",
            output: "_build"
        }
    }
}
