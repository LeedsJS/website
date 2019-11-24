const https = require('http');
const moment = require('moment-timezone');
const today = moment().tz('Europe/London');

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
        host: 'localhost',
        port: 8080,
        path: '/automation/next-event.json',
        method: 'GET',
    }, null, (eventData) => {
        eventData = JSON.parse(eventData);

        if (!eventData.id) {
            return commsMessages(getOptions, cb);
        }

        const tomorrow = moment().tz('Europe/London').add(1, 'days');
        const yesterday = moment().tz('Europe/London').subtract(1, 'days');

        let templateName;
        let subject;
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
        } else if (yesterday.isSame(eventData.date, 'day')) {
            console.log(`It's the day after the event!`);
            templateName = 'day-after-email';
            subject = `Please leave feedback about last night's event: ${eventData.title}`
        } else {
            console.log('No emails today');
            return cb(null, {});
        }

        if (templateName) {
            makeRequest({
                host: 'leedsjs.com',
                path: `/automation/${templateName}.html`,
                method: 'GET',
            }, null, (emailContent) => {
                console.log(`Grabbed the ${templateName} template`);

                sendEmail(subject, emailContent, getOptions, cb);
            })
        } else {
            commsMessages(getOptions, cb)
        }
    });
};

function commsMessages(getOptions, cb) {
    makeRequest({
        host: 'localhost',
        port: 8080,
        path: '/automation/next-comm.json',
        method: 'GET',
    }, null, (commData) => {
        commData = JSON.parse(commData);

        if (!commData.id) {
            return cb(null, {});
        }

        if (today.isSame(commData.date, 'day')) {
            sendEmail(commData.title, commData.body, getOptions, cb)
        }
        
        return cb(null, {});
    });
}

function sendEmail(subject, content, getOptions, cb) {
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
                    body: content
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
}

function makeRequest(options, body, getOptions, cb) {
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
