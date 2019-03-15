module.exports = function(eleventyConfig) {
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
            output: "../_build"
        }
    }
}
