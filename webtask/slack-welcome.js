const axios = require('axios');
const qs = require('querystring');
const crypto = require('crypto');
const timingSafeCompare = require('tsscmp');

module.exports = function (context, req, res) {
    let body = '';

    const message = {
        token: context.secrets.slack_access_token,
        link_names: true,
        text: 'Welcome to the LeedsJS Slack!',
        as_user: true,
        attachments: JSON.stringify([
            {
                title: 'Code of Conduct',
                text: `By participating in the LeedsJS slack, you agree to follow the <https://leedsjs.com/code-of-conduct|Code of Conduct>.

The short version is:
LeedsJS is dedicated to providing harassment-free experiences for everyone, regardless of gender, sexual orientation, disability, physical appearance, body size, age, race, or religion. We do not tolerate harassment of meet up participants in any form. Sexual language and imagery is not appropriate for any meet up venue or online discussion, including talks or the Slack channel. LeedsJS members violating these rules may be sanctioned or expelled from the group at the discretion of the group's organisers.

You can see the full version <https://leedsjs.com/code-of-conduct|on the LeedsJS website>.`,
                color: '#2244ff',
            }, {
                title: 'Recruitment',
                text: 'Please keep all recuitment to the #jobs channel unless someone has agreed to speak over direct messages. Any mass-spamming or harassment of other users will result in a ban from the group and slack channel.',
                color: '#009933',
            }
        ]),
    };

    if (req.method !== 'POST') {
        res.writeHead(500);
        return res.end();
    }

    req.on('data', function (data) {
        body += data;

        if (body.length > 1e6) {
            body = '';
            // Flood attack or faulty client, nuke request
            return req.connection.destroy();
        }
    });

    req.on('end', function () {
        body = JSON.parse(body);

        switch (body.type) {
            case 'url_verification': {
                // verify Events API endpoint by returning challenge if present
                res.end(JSON.stringify({
                    challenge: body.challenge
                }));
                break;
            }
            case 'event_callback': {
                // Verify the signing secret
                if (verifySignature(req)) {
                    const event = body.event;

                    if (event.type === 'team_join' && !event.is_bot) {
                        const { id } = event.user;
                        sendMessage(id, message);
                    }
                    res.writeHead(200);
                    res.end();
                } else {
                    res.writeHead(500);
                    res.end();
                }
                break;
            }
            default: {
                res.writeHead(500);
                res.end();
            }
        }
    });
}


function sendMessage(userId, message) {
    message.channel = userId;
    axios.post(`https://slack.com/api/chat.postMessage`, qs.stringify(message))
        .then((result => {
            console.log(result.data);
        }));
}

function verifySignature(req) {
    const signature = req.headers['x-slack-signature'];
    const timestamp = req.headers['x-slack-request-timestamp'];
    const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET);
    const [version, hash] = signature.split('=');

    // Check if the timestamp is too old
    const fiveMinutesAgo = ~~(Date.now() / 1000) - (60 * 5);
    if (timestamp < fiveMinutesAgo) return false;

    hmac.update(`${version}:${timestamp}:${req.rawBody}`);

    // check that the request signature matches expected value
    return timingSafeCompare(hmac.digest('hex'), hash);
}
