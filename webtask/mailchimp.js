const https = require('https');
const moment = require('moment-timezone');

module.exports = function (context, cb) {

    const getOptions = (path, method) => {
        return {
            host: `${context.secrets.mailchimp_server}.api.mailchimp.com`,
            path,
            auth: `anystring:${context.secrets.mailchimp_key}`,
            headers: {
                "content-type": "application/json"
            },
            method: method,
        }
    };

    makeRequest({
        host: 'leedsjs.com',
        path: '/automation/next-event.json',
        method: 'GET',
    }, null, (eventData) => {
        eventData = JSON.parse(eventData);

        const today = moment().tz('Europe/London');
        const tomorrow = moment().tz('Europe/London').add(1, 'days');

        let templateName = '';
        let subject = '';
        if (today.isSame(eventData.announce_date, 'day')) {
            console.log(`It's announcement day!`);
            templateName = 'announcement-email';
            subject = `Announcing our next event: ${eventData.title}`
        } else if (today.isSame(eventData.ticket_date, 'day')) {
            console.log(`It's ticket day!`);
            templateName = 'ticket-email';
            subject = `Tickets are now available for our next event: ${eventData.title}`
        } else if (tomorrow.isSame(eventData.date, 'day')) {
            console.log(`It's the day before the event!`);
            templateName = 'day-before-email';
            subject = `Tomorrow is our next event: ${eventData.title}`
        } else {
            console.log('No emails today');
            return cb(null, {});
        }

        makeRequest({
            host: 'leedsjs.com',
            path: `/automation/${templateName}.html`,
            method: 'GET',
        }, null, (emailContent) => {
            console.log(`Grabbed the ${templateName} template`);

            makeRequest(getOptions('/3.0/campaigns', 'POST'), {
                type: 'regular',
                recipients: {
                    list_id: '5cdb704e1c'
                },
                settings: {
                    subject_line: subject,
                    from_name: 'LeedsJS',
                    reply_to: 'leedsjs@gmail.com'

                }
            }, (campaignData) => {
                campaignData = JSON.parse(campaignData);

                console.log(`Created campaign with ID ${campaignData.id}`);

                makeRequest(getOptions(`/3.0/campaigns/${campaignData.id}/content`, 'PUT'), {
                    template: {
                        id: 20713,
                        sections: {
                            body: emailContent
                        }
                    }
                }, () => {
                    console.log(`Set email content`);

                    makeRequest(getOptions(`/3.0/campaigns/${campaignData.id}/actions/send`, 'POST'), null, () => {
                        console.log('Sent!');

                        cb(null, {});
                    })
                })
            })
        })
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
