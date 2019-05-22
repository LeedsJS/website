class NextEvent {
    data() {
        return {
            permalink: "automation/next-event.json"
        };
    }

    render({
        events,
        talks,
        speakers
    }) {
        const event = events.nextEvent;

        const eventObj = {
            id: event.id,
            title: event.title,
            blurb: event.blurb,
            talks: [],
            sponsors: event.sponsors,
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

        return JSON.stringify(eventObj, null, 4);
    }
}

module.exports = NextEvent;
