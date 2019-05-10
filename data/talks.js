module.exports = () => {
    return {
        get(id) {
            return this.data[id];
        },
    }
}
