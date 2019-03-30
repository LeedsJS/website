module.exports = () => {
    const data = [
        {
            "id": "2019-02-27",
            "title": "testy test test",
            "short_blurb": "this is a test, there's nothing really here",
            "blurb": "this is a test, there's nothing really here",
            "talks": [
                "test_1",
                "test_2"
            ],
            "sponsors": [
                "sky-betting-and-gaming",
                "bruntwood",
                "jetbrains"
            ],
            "date": "2019-02-27",
            "start_time": "18:30",
            "end_time": "20:30",
            "ticket_date": "2019-02-20",
            "announce_date": "2019-02-01"
        },
        {
            "id": "2019-01-27",
            "title": "testy test test",
            "short_blurb": "this is a test, there's nothing really here",
            "blurb": "this is a test, there's nothing really here",
            "talks": [
                "test_1",
                "test_2"
            ],
            "sponsors": [
                "sky-betting-and-gaming",
                "bruntwood",
                "jetbrains"
            ],
            "date": "2019-01-27",
            "start_time": "18:30",
            "end_time": "20:30",
            "ticket_date": "2019-01-20",
            "announce_date": "2019-01-01"
        },
        {
            "id": "2019-03-27",
            "title": "testy test test",
            "short_blurb": "this is a test, there's nothing really here",
            "blurb": "this is a test, there's nothing really here",
            "talks": [
                "test_2",
                "test_3",
                "test_4"
            ],
            "sponsors": [
                "sky-betting-and-gaming",
                "bruntwood",
                "jetbrains"
            ],
            "date": "2019-03-29",
            "start_time": "18:30",
            "end_time": "20:30",
            "ticket_date": "2019-03-27",
            "announce_date": "2019-03-27"
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
