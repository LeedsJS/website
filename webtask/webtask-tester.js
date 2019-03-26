require('dotenv').config();

const webtask = require(`./${process.argv[2]}`);

const context = {
    secrets: process.env
}

webtask(context, (error, result) => {
    console.log(error);
    console.log(result);
});
