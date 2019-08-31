const moment = require('moment-timezone');

module.exports = () => {
    return {
        get(id) {
            return addMethods(this.data[id]);
        },

        get nextEvent() {
            const now = moment().tz('Europe/London');

            const keys = Object.keys(this.data).filter((key) => {
                const event = this.data[key];

                const dayAfterEvent = moment(event.date).add(1,'day');

                return now.isSameOrAfter(event.announce_date) && now.isSameOrBefore(dayAfterEvent, 'day');
            }).sort((a, b) => {
                return moment(this.data[a].date) - moment(this.data[b].date);
            })

            return keys[0] ? addMethods(this.data[keys[0]]) : {
                talks: []
            };
        },

        get announcedEvents() {
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
    return Object.assign({}, event, {
        ticketsAvailable() {
            const now = moment().tz('Europe/London');

            return now.isSameOrAfter(this.ticket_date) && now.isSameOrBefore(this.date, 'day');
        },

        isUpcomingEvent() {
            const now = moment().tz('Europe/London');

            return now.isSameOrBefore(this.date, 'day');
        },

        isWithinFeedbackWindow() {
            const now = moment().tz('Europe/London');
            const deadline = moment(this.date).tz('Europe/London').add(7, "days");

            return now.isSameOrBefore(deadline, 'day');
        },

        isAnnounced() {
            const now = moment().tz('Europe/London');

            return now.isSameOrAfter(this.announce_date, 'day');
        }
    });
}
