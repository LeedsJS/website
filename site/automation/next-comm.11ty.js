const markdownIt = require('markdown-it');
const md = new markdownIt();

class NextComm {
    data() {
        return {
            permalink: "automation/next-comm.json"
        };
    }

    render({
        comms
    }) {
        const comm = comms.nextComm;

        if (!comm.id) {
            return JSON.stringify({});
        }

        const nextComm = {
            ...comm,
            body: md.render(comm.body)
        }

        return JSON.stringify(nextComm, null, 4);
    }
}

module.exports = NextComm;
