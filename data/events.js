module.exports = () => {
    const data = [
        {
            "id": "2019-03-27",
            "title": "March - Auth and BFFs",
            "blurb": "This month we have a couple of great talks from Steve Hobbs and Luke Oliff, as well as a chance to win a code for a year subscription for a Jetbrains toolbox product of your choice.",
            "talks": [
                "an-introduction-to-oidc-for-javascript-developers",
                "building-a-deployable-react-client-and-express-backend-for-frontend"
            ],
            "sponsors": [
                "sky-betting-and-gaming",
                "bruntwood",
                "jetbrains"
            ],
            "date": "2019-03-27",
            "start_time": "18:30",
            "end_time": "20:30",
            "ticket_date": "2019-03-20",
            "announce_date": "2019-03-01"
        },
        {
            "id": "2019-04-24",
            "title": "April - PWAs, JAM and Headless CMS",
            "blurb": "This month we have Jamie Bradley and Sam Beckham with us for an ancronym packed event! We'll also be giving away 2 codes for a year subscription for a Jetbrains toolbox product of your choice and a ticket for the Amsterdam JSNation conference!",
            "talks": [
                "finding-my-sanity",
                "making-gitlab-a-pwa"
            ],
            "sponsors": [
                "sky-betting-and-gaming",
                "bruntwood",
                "jetbrains",
                "jsnation"
            ],
            "date": "2019-04-24",
            "start_time": "18:30",
            "end_time": "20:30",
            "ticket_date": "2019-04-17",
            "announce_date": "2019-04-01"
        }
    ];

    const nextEvent = data.sort((a, b) => {
        return a.date < b.date;
    })[0];

    return {
        data,
        next_event: nextEvent
    };
}
