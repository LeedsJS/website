const moment = require('moment-timezone');

module.exports = () => {
    return {
        get(id) {
            return addMethods(this.data[id]);
        },

        getNextEvent() {
            const now = moment().tz('Europe/London');

            const keys = Object.keys(this.data).filter((key) => {
                const event = this.data[key];

                return now.isSameOrAfter(event.announce_date) && now.isSameOrBefore(event.date, 'day');
            }).sort((a, b) => {
                return moment(this.data[a].date) - moment(this.data[b].date);
            })

            return keys[0] ? addMethods(this.data[keys[0]]) : undefined;
        },

        getAnnouncedEvents() {
            const now = moment().tz('Europe/London');

            const events = Object.keys(this.data).filter((key) => {
                return now.isSameOrAfter(this.data[key].announce_date);
            }).sort((a, b) => {
                return moment(this.data[b].date) - moment(this.data[a].date);
            }).reduce((obj, key) => {
                obj[key] = addMethods(this.data[key]);

                return obj;
            }, {});

            return events;
        }
    };
}


function addMethods(event) {
    event.ticketsAvailable = ticketsAvailable.bind(event);
    event.isUpcomingEvent = isUpcomingEvent.bind(event)

    return event;
}

function ticketsAvailable() {
    const now = moment().tz('Europe/London');

    return now.isSameOrAfter(this.ticket_date) && now.isSameOrBefore(this.date, 'day');
}

function isUpcomingEvent() {
    const now = moment().tz('Europe/London');

    return now.isSameOrBefore(this.date, 'day');
}
