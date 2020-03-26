const fs = require("fs").promises;
const path = require("path");
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
  const eventDataFile = await fs.readFile(
    path.join(__dirname, "..", "build", "automation", "next-event.json")
  );
  const eventData = JSON.parse(eventDataFile);

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
    prizeDraw.setup();
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
  const commDataFile = await fs.readFile(
    path.join(__dirname, "..", "build", "automation", "next-comm.json")
  );
  const commData = JSON.parse(commDataFile);

  if (!commData.id || !today.isSame(commData.date, "day")) {
    return console.log("No comms to send today!");
  }

  console.log(`Sending "${commData.title}"`);

  mailchimp.comms(commData.title, commData.body);
  twitter.comms(commData.id, commData.tweet);
}

eventMessages();
