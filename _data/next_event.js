const moment = require('moment');
const events = require('./events.json');

module.exports = function() {
    const nextEventDate = Object.keys(events).filter((date) => {
        return moment().isSameOrBefore(date, 'day');
    });

    return events[nextEventDate];
}
