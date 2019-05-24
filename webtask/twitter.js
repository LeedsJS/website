const Twitter = require('twitter');
const https = require('https');
const moment = require('moment-timezone');

module.exports = function (context, cb) {
    const client = new Twitter({
        consumer_key: context.secrets.twitter_consumer_key,
        consumer_secret: context.secrets.twitter_consumer_secret,
        access_token_key: context.secrets.twitter_access_token_key,
        access_token_secret: context.secrets.twitter_access_token_secret
    });

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

            const today = moment().tz('Europe/London');
            const tomorrow = moment().tz('Europe/London').add(1, 'days');

            const event = moment(eventData.date);

            const speakers = eventData.talks.map((talk) => {
                return talk.speaker.twitter ? `@${talk.speaker.twitter}` : talk.speaker.name;
            }).reduce((acc, val, i, arr) => {
                if (acc.length === 0) {
                    return val;
                } else if (i === arr.length - 1) {
                    return `${acc} and ${val}`;
                } else {
                    return `${acc}, ${val}`;
                }
            }, '');

            let message = '';
            if (today.isSame(eventData.announce_date, 'day')) {
                console.log(`It's announcement day!`);
                message = `We've just announced our next event: ${eventData.title}

Join us on ${event.format('Do MMM')} to hear from ${speakers}!

More details: https://leedsjs.com/events/${eventData.id}`;
            } else if (today.isSame(eventData.ticket_date, 'day')) {
                console.log(`It's ticket day!`);
                message = `We've just released the tickets for our next event: ${eventData.title}

Join us on ${event.format('Do MMM')} to hear from ${speakers}!

More details and tickets: https://leedsjs.com/events/${eventData.id}`;
            } else if (today.subtract(2, 'days').isSame(eventData.ticket_date, 'day')) {
                console.log(`It's ticket reminder day!`);
                message = `A few days ago we released the tickets for our next event: ${eventData.title}

Join us on ${event.format('Do MMM')} to hear from ${speakers}!

More details and tickets: https://leedsjs.com/events/${eventData.id}`;
            } else if (tomorrow.isSame(eventData.date, 'day')) {
                console.log(`It's the day before the event!`);
               message = `Our next event is tomorrow: ${eventData.title}

Join us on ${event.format('Do MMM')} to hear from ${speakers}!

More details and tickets: https://leedsjs.com/events/${eventData.id}`;
            } else {
                console.log('No tweets today');
                return cb(null, {});
            }

            client.post('statuses/update', {status: message},  function(error, tweet, response) {
                if (error) {
                    return console.log(error);
                };
                console.log(tweet);
                cb(null, {});
            });
        });
    });
};
