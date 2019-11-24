const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

const types = {
    comm: {
        scaffold: 'comm.js',
        field: "id"
    },
    event: {
        scaffold: 'event.js',
        field: "id"
    },
    speaker: {
        scaffold: 'speaker.js',
        field: "name"
    },
    sponsor: {
        scaffold: 'sponsor.js',
        field: "name"
    },
    talk: {
        scaffold: 'talk.js',
        field: "title"
    }
}

const [,,type, name] = process.argv;

if (types[type.toLowerCase()]) {
    const selectedType = types[type.toLocaleLowerCase()];
    const fileName = `${slug(name.toLowerCase())}.js`;
    const template = fs.readFileSync(path.join(__dirname, '..', 'scaffolds', selectedType.scaffold), 'utf8');

    const content = template.replace(`{{ ${selectedType.field} }}`, name);

    fs.writeFileSync(
        path.join(
            __dirname,
            '..',
            'data',
            `${type.toLocaleLowerCase()}s`,
            'data',
            fileName
        ),
        content
    );
} else {
    console.log(`No scaffold for type of "${type}"`);
}

function slug(str) {
    return slugify(str, {
        remove: /[*+~.()'"!:@]/g
    })
}