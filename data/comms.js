const moment = require('moment-timezone');

module.exports = () => {
    return {
        get(id) {
            return this.data[id];
        },
        
        get nextComm() {
            const now = moment().tz('Europe/London').startOf("day");

            const keys = Object.keys(this.data).filter((key) => {
                const comm = this.data[key];

                return now.isSameOrBefore(comm.date);
            }).sort((a, b) => {
                return moment(this.data[a].date) - moment(this.data[b].date);
            })

            return keys[0] ? this.data[keys[0]] : {};
        }
    }
}
