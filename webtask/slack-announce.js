const https = require('https');
const moment = require('moment-timezone');
const qs = require('querystring');

const channel = '#general';

module.exports = function (context, cb) {
    makeRequest({
        host: 'leedsjs.com',
        path: '/automation/next-event.json',
        method: 'GET',
    }, null, (eventData) => {
        eventData = JSON.parse(eventData);

        const today = moment().tz('Europe/London');
        const tomorrow = moment().tz('Europe/London').add(1, 'days');

        const event = moment(eventData.date);

        const talks = eventData.talks.reduce((acc, talk) => {
            return `${acc}
${talk.name} - ${talk.speaker.name}`;
        }, `*Talks:*`);

        let title = '';
        let text = '';
        if (today.isSame(eventData.announce_date, 'day')) {
            console.log(`It's announcement day!`);
            title = 'Announcing our next event!';
            text = `We've just announced our next event: ${eventData.title}

${eventData.blurb}

${talks}

*Date:* ${event.format('Do MMMM')}
*Time:* ${eventData.start_time} - ${eventData.end_time}

More details: https://leedsjs.com/events/${eventData.id}`;
        } else if (today.isSame(eventData.ticket_date, 'day')) {
            console.log(`It's ticket day!`);
            title = 'Tickets are now available for our next event!';
            text = `We've just released the tickets for our next event: ${eventData.title}

${eventData.blurb}

${talks}

*Date:* ${event.format('Do MMMM')}
*Time:* ${eventData.start_time} - ${eventData.end_time}

More details and tickets: https://leedsjs.com/events/${eventData.id}`;
        } else if (tomorrow.isSame(eventData.date, 'day')) {
            console.log(`It's the day before the event!`);
            title = 'LeedsJS is tomorrow!';
            text = `Our next event is tomorrow: ${eventData.title}

${eventData.blurb}

${talks}

*Date:* ${event.format('Do MMMM')}
*Time:* ${eventData.start_time} - ${eventData.end_time}

More details and tickets: https://leedsjs.com/events/${eventData.id}`;
        } else {
            console.log('No slack posts today');
            return cb(null, {});
        }

        sendMessage(context.secrets.slack_access_token, channel, title, text, cb)
    });
};

function sendMessage(token, channel, title, text, cb) {
    const message = {
        token: token,
        link_names: true,
        as_user: true,
        channel,
        attachments: JSON.stringify([{
            title,
            text,
            color: '#007777',
        }]),
    };

    makeRequest({
        host: 'slack.com',
        path: '/api/chat.postMessage',
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    }, qs.stringify(message), result => {
        cb(null, {});
    });
}

function makeRequest(options, body, cb) {
    const req = https.request(options, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            cb(data);
        });
    });

    if (body) {
        req.write(body);
    }

    req.end();
}
