const https = require('https');
const moment = require('moment-timezone');

module.exports = function (context, cb) {
    https.get({
        host: 'leedsjs.com',
        path: '/automation/next-event.json'
    }, (res) => {
        let eventData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            eventData += chunk;
        });
        res.on('end', () => {
            eventData = JSON.parse(eventData);

            if (!eventData.id) {
                return cb(null, {});
            }

            const today = moment().tz('Europe/London');

            if (today.isSame(eventData.date, 'day')) {
                console.log(`It's event day!`);

                const req = https.request({
                    method: 'POST',
                    host: 'leedsjs-prize-draw.glitch.me',
                    path: `/admin/clear/${context.secrets.prize_draw_clear}`
                });

                req.write('{}');
                req.end();
                cb(null, {});
            } else {
                console.log('No prize-draw stuff today');
                return cb(null, {});
            }
        });
    });
};
