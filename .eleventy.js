const moment = require('moment');

module.exports = function(eleventyConfig) {
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

    const today = moment();
    eleventyConfig.addNunjucksFilter("isfutureevent", function (date) {
        return today.isSameOrBefore(date, 'day');
    });

    return {
        templateFormats: [
            "njk"
        ],

        pathPrefix: "/",
        markdownTemplateEngine: "liquid",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        passthroughFileCopy: true,
        dir: {
            input: "_pages",
            includes: "../_includes",
            data: "../_data",
            output: "_build"
        }
    }
}
