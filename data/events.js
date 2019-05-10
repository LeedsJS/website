const moment = require('moment-timezone');

module.exports = () => {
    return {
        get(id) {
            return this.data[id];
        },

        getNextEvent() {
            const now = moment().tz('Europe/London');

            const keys = Object.keys(this.data).filter((key) => {
                const event = this.data[key];

                return now.isSameOrAfter(event.announce_date) && now.isSameOrBefore(event.date, 'day');
            }).sort((a, b) => {
                return moment(this.data[a].date) - moment(this.data[b].date);
            })

            return keys[0] ? this.data[keys[0]] : undefined;
        },

        getAnnouncedEvents() {
            const now = moment().tz('Europe/London');

            const events = Object.keys(this.data).filter((key) => {
                return now.isSameOrAfter(this.data[key].announce_date);
            }).sort((a, b) => {
                return moment(this.data[b].date) - moment(this.data[a].date);
            }).reduce((obj, key) => {
                obj[key] = this.data[key];

                return obj;
            }, {});

            return events;
        }
    };
}
