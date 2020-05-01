const fs = require("fs").promises;
const path = require("path");
const moment = require("moment-timezone");

const mailchimp = require("./mailchimp");
const twitter = require("./twitter");
const tito = require("./tito");
const prizeDraw = require("./prizeDraw");

const today = moment().tz("Europe/London");
const tomorrow = moment().tz("Europe/London").add(1, "days");
const yesterday = moment().tz("Europe/London").subtract(1, "days");

async function eventMessages(publishDir) {
  console.log("Grabbing event data");
  const eventDataFile = await fs.readFile(
    path.join(publishDir, "automation", "next-event.json"),
    "utf8"
  );
  const eventData = JSON.parse(eventDataFile);

  if (!eventData.id) {
    console.log("No event data, lets try comms!");
    return await commsMessages(publishDir);
  }

  if (today.isSame(eventData.announce_date, "day")) {
    console.log("It's announcement day!");
    await mailchimp.announce(eventData.title);
    await twitter.announce(eventData);
    if (!eventData.is_remote) {
      tito.announce(eventData);
    }
  } else if (
    today.isSame(eventData.ticket_date, "day") &&
    !eventData.is_remote
  ) {
    console.log("It's ticket day!");
    await mailchimp.ticket(eventData.title);
    await twitter.ticket(eventData);
  } else if (
    moment(today)
      .tz("Europe/London")
      .subtract(2, "days")
      .isSame(eventData.ticket_date, "day") &&
    !eventData.is_remote
  ) {
    console.log("It's ticket reminder day!");
    await twitter.ticketRemind(eventData);
  } else if (tomorrow.isSame(eventData.date, "day")) {
    console.log("It's the day before!");
    await mailchimp.dayBefore(eventData.title);
    await twitter.dayBefore(eventData);
  } else if (today.isSame(eventData.date, "day")) {
    console.log("It's event day!");
    await prizeDraw.setup();
    await prizeDraw.clear();
  } else if (yesterday.isSame(eventData.date, "day")) {
    console.log("It's the day after!");
    await mailchimp.dayAfter(eventData.title);
    await twitter.dayAfter(eventData);
  } else {
    console.log("No event stuff today, lets try comms!");
    return await commsMessages(publishDir);
  }
}

async function commsMessages(publishDir) {
  const commDataFile = await fs.readFile(
    path.join(publishDir, "automation", "next-comm.json")
  );
  const commData = JSON.parse(commDataFile);

  if (!commData.id || !today.isSame(commData.date, "day")) {
    return console.log("No comms to send today!");
  }

  console.log(`Sending "${commData.title}"`);

  await mailchimp.comms(commData.title, commData.body);
  await twitter.comms(commData.id, commData.tweet);
}

module.exports = {
  onSuccess: async ({ constants }) => {
    if (process.env.CONTEXT === "production") {
      await eventMessages(constants.PUBLISH_DIR);
    }
  },
};
