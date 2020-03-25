const got = require("got");
const moment = require("moment-timezone");

const BASE_URL = process.env.BASE_URL || "https://leedsjs.com";

const mailchimp = require("./mailchimp");
const twitter = require("./twitter");
const tito = require("./tito");
const prizeDraw = require("./prizeDraw");

const today = moment().tz("Europe/London");
const tomorrow = moment()
  .tz("Europe/London")
  .add(1, "days");
const yesterday = moment()
  .tz("Europe/London")
  .subtract(1, "days");

async function eventMessages() {
  const { body: eventData } = await got(
    `${BASE_URL}/automation/next-event.json`,
    {
      responseType: "json"
    }
  );

  if (!eventData.id) {
    console.log("No event data, lets try comms!");
    return commsMessages();
  }

  if (today.isSame(eventData.announce_date, "day")) {
    console.log("It's announcement day!");
    mailchimp.announce(eventData.title);
    twitter.announce(eventData);
    tito.announce(eventData);
  } else if (today.isSame(eventData.ticket_date, "day")) {
    console.log("It's ticket day!");
    mailchimp.ticket(eventData.title);
    twitter.ticket(eventData);
  } else if (
    moment(today)
      .tz("Europe/London")
      .subtract(2, "days")
      .isSame(eventData.ticket_date, "day")
  ) {
    console.log("It's ticket reminder day!");
    twitter.ticketRemind(eventData);
  } else if (tomorrow.isSame(eventData.date, "day")) {
    console.log("It's the day before!");
    mailchimp.tomorrow(eventData.title);
    twitter.tomorrow(eventData);
  } else if (today.isSame(eventData.date, "day")) {
    console.log("It's event day!");
    prizeDraw.clear();
  } else if (yesterday.isSame(eventData.date, "day")) {
    console.log("It's the day after!");
    mailchimp.yesterday(eventData.title);
    twitter.yesterday(eventData);
  } else {
    console.log("No event stuff today, lets try comms!");
  }
}

async function commsMessages() {
  const { body: commData } = await got(
    `${BASE_URL}/automation/next-comm.json`,
    {
      responseType: "json"
    }
  );

  if (!commData.id || !today.isSame(commData.date, "day")) {
    return console.log("No comms to send today!");
  }

  mailchimp.comms(commData.title, commData.body);
  twitter.comms(commData.id, commData.tweet);
}

eventMessages();
