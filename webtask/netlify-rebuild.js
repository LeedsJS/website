const https = require('https');

module.exports = function (context, cb) {
    const req = https.request({
        method: 'POST',
        host: 'api.netlify.com',
        path: `/build_hooks/${context.secrets.hook_id}`
    });

    req.write('{}');
    req.end();
    cb(null, {});
};
