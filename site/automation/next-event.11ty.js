class NextEvent {
    data() {
        return {
            permalink: "automation/next-event.json"
        };
    }

    render({
        events,
        talks,
        speakers,
        sponsors
    }) {
        const event = events.nextEvent;

        if (!event.id) {
            return JSON.stringify({});
        }

        const eventObj = {
            id: event.id,
            title: event.title,
            blurb: event.blurb,
            talks: [],
            sponsors: [],
            date: event.date,
            start_time: event.start_time,
            end_time: event.end_time,
            ticket_date: event.ticket_date,
            announce_date: event.announce_date
        };

        eventObj.talks = event.talks.map((talkId) => {
            const talk = talks.get(talkId);
            const speaker = speakers.get(talk.speaker);

            const talkObj = {
                name: talk.title,
                speaker: {
                    name: speaker.name,
                }
            }

            if (speaker.twitter) {
                talkObj.speaker.twitter = speaker.twitter;
            }

            return talkObj;
        });

        eventObj.sponsors = event.sponsors.map((sponsorId) => {
            const sponsor = sponsors.get(sponsorId);

            const sponsorObj = {
                name: sponsor.name,
            }

            if (sponsor.twitter) {
                sponsorObj.twitter = sponsor.twitter;
            }

            return sponsorObj;
        });

        return JSON.stringify(eventObj, null, 4);
    }
}

module.exports = NextEvent;
