module.exports = () => {
    return {
        get(id) {
            return this.data[id];
        },

        getSpeakerTalks(speaker_id) {
            return Object.keys(this.data).filter((key) => {
                return this.data[key].speaker === speaker_id;
            }).reduce((obj, key) => {
                obj[key] = this.data[key];

                return obj;
            }, {}) || undefined;
        }
    }
}
