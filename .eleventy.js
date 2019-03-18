const moment = require('moment');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("_site/img");
    eleventyConfig.addPassthroughCopy("_site/styles.css");
    eleventyConfig.addPassthroughCopy("_site/script.js");

    eleventyConfig.addNunjucksFilter("datesort", function(obj) {
        const newObj = {};

        Object.keys(obj)
            .sort()
            .reverse()
            .forEach((key) => {
                newObj[key] = obj[key];
            });

        return newObj;
    });

     eleventyConfig.addNunjucksFilter("objfirst", function (obj) {
         return obj[Object.keys(obj)[0]];
     });


    eleventyConfig.addNunjucksFilter("isfutureevent", function (date) {
        return moment().isSameOrBefore(date, 'day');
    });

    eleventyConfig.addNunjucksFilter("date", function (date, format = "YYYY-MM-DD") {
        return moment(date).format(format);
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
            input: "_site",
            includes: "../_includes",
            data: "../_data",
            output: "_build"
        }
    }
}
