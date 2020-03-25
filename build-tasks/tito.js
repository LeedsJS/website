const got = require("got");
const moment = require("moment-timezone");

async function announce(eventData) {
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token token=${process.env.tito_key}`
    }
  };

  await got
    .post("https://api.tito.io/v3/leedsjs/events", {
      json: {
        title: `LeedsJS: ${eventData.title}`,
        slug: eventData.id
      },
      responseType: "json",
      ...options
    })
    .catch(error => {
      console.log(error.response.body);
    });

  console.log("Event created");

  const ticketReleaseStart = moment
    .tz(eventData.ticket_date, "Europe/London")
    .hour(10)
    .minute(0)
    .toISOString();
  const ticketReleaseEnd = moment
    .tz(eventData.date, "Europe/London")
    .hour(18)
    .minute(30)
    .toISOString();

  const ticketRelease = await got.post(
    `https://api.tito.io/v3/leedsjs/${eventData.id}/releases`,
    {
      json: {
        title: "Attendee",
        quantity: 74,
        start_at: ticketReleaseStart,
        end_at: ticketReleaseEnd,
        price: 0,
        waiting_list_enabled_during_sold_out: true
      },
      responseType: "json",
      ...options
    }
  );

  console.log("Tickets created");
  const startTimeParts = eventData.start_time.split(":");
  const startDate = moment
    .tz(eventData.date, "Europe/London")
    .hour(startTimeParts[0])
    .minute(startTimeParts[1])
    .toISOString();

  const endTimeParts = eventData.end_time.split(":");
  const endDate = moment
    .tz(eventData.date, "Europe/London")
    .hour(endTimeParts[0])
    .minute(endTimeParts[1])
    .toISOString();

  const titoBlurb = `${eventData.blurb}

[Full event details](https://leedsjs.com/events/${eventData.id}/)`;

  await got.patch(`https://api.tito.io/v3/leedsjs/${eventData.id}`, {
    json: {
      live: true,
      test_mode: false,
      start_date: startDate,
      end_date: endDate,
      description: titoBlurb
    },
    responseType: "json",
    ...options
  });

  await got.patch(
    `https://api.tito.io/v3/leedsjs/${eventData.id}/releases/${ticketRelease.body.release.slug}/activation`,
    {
      json: {},
      responseType: "json",
      ...options
    }
  );

  console.log("Tickets live");
}

module.exports = {
  announce
};
