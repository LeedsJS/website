const https = require('https');
const moment = require('moment-timezone');

module.exports = function (context, cb) {

    const getOptions = (path, method) => {
        return {
            host: `api.tito.io`,
            path: `/v3/leedsjs/${path}`,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                Authorization: `Token token=${context.secrets.tito_key}`,
            },
            method: method
        }
    };

    makeRequest({
        host: 'leedsjs.com',
        path: '/automation/next-event.json',
        method: 'GET',
    }, null, (eventData) => {
        eventData = JSON.parse(eventData);

        if (!eventData.id) {
            return cb(null, {});
        }

        const today = moment().tz('Europe/London');

        if (today.isSame(eventData.announce_date, 'day')) {
            console.log(`It's announcement day, create the tickets!`);

            makeRequest(getOptions('events', 'POST'), {
                title: `LeedsJS: ${eventData.title}`,
                slug: eventData.id
            }, () => {
                console.log('Event created');
                const ticketRelease = moment.tz(eventData.ticket_date, 'Europe/London')
                    .hour(10).minute(0).toISOString();
                const ticketEnd = moment.tz(eventData.date, 'Europe/London')
                    .hour(18).minute(30).toISOString();

                makeRequest(getOptions(`${eventData.id}/releases`, 'POST'), {
                    title: 'Attendee',
                    quantity: 74,
                    start_at: ticketRelease,
                    end_at: ticketEnd,
                    price: 0,
                    waiting_list_enabled_during_sold_out: true
                }, (releaseData) => {
                    console.log('Tickets created')
                    const startTimeParts = eventData.start_time.split(':');
                    const startDate = moment.tz(eventData.date, 'Europe/London')
                        .hour(startTimeParts[0]).minute(startTimeParts[1]).toISOString();

                    const endTimeParts = eventData.end_time.split(':');
                    const endDate = moment.tz(eventData.date, 'Europe/London')
                        .hour(endTimeParts[0]).minute(endTimeParts[1]).toISOString();

                    const titoBlurb = `${eventData.blurb}

[Full event details](https://leedsjs.com/events/${eventData.id}/)`;
                    makeRequest(getOptions(`${eventData.id}`, 'PATCH'), {
                        live: true,
                        test_mode: false,
                        start_date: startDate,
                        end_date: endDate,
                        description: titoBlurb,
                    }, () => {
                        releaseData = JSON.parse(releaseData);

                        makeRequest(getOptions(`${eventData.id}/releases/${releaseData.release.slug}/activation`, 'PATCH'),
                        {},
                        (data) => {
                            console.log('Tickets live')
                            cb(null, {});
                        });
                    });
                });
            });
        } else {
            cb(null, {});
        }
    });
};

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
        req.write(JSON.stringify(body));
    }

    req.end();
}
