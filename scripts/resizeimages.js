const sharp = require('sharp');
const find = require('find');
const fs = require('fs');

const folders = [
    'build/img/sponsors/',
    'build/img/speakers/'
];

folders.forEach((folder) => {
    find.file(/\.(png|jpg|gif)$/, folder, imgFiles => {
        imgFiles.forEach((img) => {
            sharp(img).resize({ width: 300}).toBuffer((err, data) => {
                fs.writeFileSync(img, data);
            });
        })
    });
});

