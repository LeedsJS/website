const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

const types = {
    event: {
        scaffold: require('../scaffolds/event.json'),
        field: "id"
    },
    speaker: {
        scaffold: require('../scaffolds/speaker.json'),
        field: "name"
    },
    sponsor: {
        scaffold: require('../scaffolds/sponsor.json'),
        field: "name"
    },
    talk: {
        scaffold: require('../scaffolds/talk.json'),
        field: "title"
    }
}

const [,,type, name] = process.argv;

if (types[type.toLowerCase()]) {
    const selectedType = types[type.toLocaleLowerCase()];
    const fileName = `${slugify(name.toLowerCase())}.json`;
    const template = selectedType.scaffold;

    template[selectedType.field] = name;

    fs.writeFileSync(path.join(
        __dirname,
        '..',
        'data',
        `${type.toLocaleLowerCase()}s`,
        'data',
        fileName
    ), JSON.stringify(template, ' ', 4));
} else {
    console.log(`No scaffold for type of "${type}"`);
}

