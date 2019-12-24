'use strict';

const map = require('map-stream');
const vfs = require('vinyl-fs');
const jsonfile = require('jsonfile');
const colors = require('colors');
const fs = require('fs');

let db = {};
try {
    db = jsonfile.readFileSync('./db.json');
} catch (e) {
    // no file
}

let files = [];
for (let i in db) {
    files = files.concat(db[i]);
}

if (files.length) {
    vfs.src(['./**/*.{jpg,png,gif}', '!./node_modules/**/*', '!./source/**/*'])
        .pipe(map((file, cb) => {
            if (0 > files.indexOf(file.basename)) {
                // 不存在
                try {
                    fs.unlinkSync(file.path);
                    console.log('[File deleted]'.bold.red, file.path);
                } catch (e) {
                    console.log('[File delete failed]'.bold.yellow, file.path);
                }
            }
        }));
}