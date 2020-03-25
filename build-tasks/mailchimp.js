const got = require("got");

const BASE_URL = process.env.BASE_URL || "https://leedsjs.com";

// Test segment:
// segment_opts: {
//   saved_segment_id: 486022
// }

async function announce(eventTitle) {
  const templateName = "announcement-email";
  const subject = `Announcing our next event: ${eventTitle}`;

  const content = await getTemplate(templateName);
  sendEmail(subject, content);
}

async function ticket(eventTitle) {
  const templateName = "ticket-email";
  const subject = `Tickets are now available for our next event: ${eventTitle}`;

  const content = await getTemplate(templateName);
  sendEmail(subject, content);
}

async function dayBefore(eventTitle) {
  const templateName = "day-before-email";
  const subject = `Tomorrow is our next event: ${eventTitle}`;

  const content = await getTemplate(templateName);
  sendEmail(subject, content);
}

async function dayAfter(eventTitle) {
  const templateName = "day-after-email";
  const subject = `Please leave feedback about last night's event: ${eventTitle}`;

  const content = await getTemplate(templateName);
  sendEmail(subject, content);
}

async function comms(title, body) {
  sendEmail(title, body);
}

async function getTemplate(templateName) {
  console.log(`Grabbing the ${templateName} template`);
  const response = await got(`${BASE_URL}/automation/${templateName}.html`);

  return response.body;
}

async function sendEmail(subject, content) {
  console.log("sending " + subject);

  const authOptions = {
    username: "anystring",
    password: process.env.mailchimp_key
  };

  const campaign = await got
    .post(
      `https://${process.env.mailchimp_server}.api.mailchimp.com/3.0/campaigns`,
      {
        json: {
          type: "regular",
          recipients: {
            list_id: "5cdb704e1c"
          },
          settings: {
            subject_line: subject,
            from_name: "LeedsJS",
            reply_to: "leedsjs@gmail.com"
          }
        },
        responseType: "json",
        ...authOptions
      }
    )
    .catch(error => {
      console.log(error.response.body);
      process.exit();
    });

  console.log(`created campaign with id ${campaign.body.id}`);

  await got.put(
    `https://${process.env.mailchimp_server}.api.mailchimp.com/3.0/campaigns/${campaign.body.id}/content`,
    {
      json: {
        template: {
          id: 20713,
          sections: {
            body: content
          }
        }
      },
      responseType: "json",
      ...authOptions
    }
  );

  await got.post(
    `https://${process.env.mailchimp_server}.api.mailchimp.com/3.0/campaigns/${campaign.body.id}/actions/send`,
    {
      json: {
        template: {
          id: 20713,
          sections: {
            body: content
          }
        }
      },
      responseType: "json",
      ...authOptions
    }
  );
}

module.exports = {
  announce,
  ticket,
  dayBefore,
  dayAfter,
  comms
};
