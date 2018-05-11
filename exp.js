'use strict';

const map = require('map-stream');
const vfs = require('vinyl-fs');
const mv = require('move-file');
const path = require('path');
const fs = require('fs');
const jsonfile = require('jsonfile');
const sha1 = require('sha1');
const collect = require('collect.js');
const colors = require('colors');

let db = {};
try {
    db = jsonfile.readFileSync('./db.json');
} catch (e) {
    // no file
}

let config = jsonfile.readFileSync('./package.json');

vfs.src(['./source/**/*.{jpg,png,gif}'])
    .pipe(map((file, cb) => {
        let fileNS = path.relative(path.resolve(config.source_dir), path.dirname(file.path));
        let sha1Name = sha1(file.contents);
        let fileName = `${sha1Name}${path.extname(file.path).toLowerCase()}`;
        let filePath = `${fileName.slice(0, 1)}/${fileName.slice(1, 2)}/${fileName}`;
        let from = path.resolve(file.path);
        let to = path.resolve(`./${filePath}`);

        if (!db.hasOwnProperty(fileNS)) {
            db[fileNS] = [];
        }

        console.log(`\n{${from}} => ${to.yellow}`);

        if (db[fileNS].indexOf(fileName) === -1) {
            db[fileNS].push(fileName);

            console.log(`[DB ADDED] ${'[NS]'.bold.red}${fileNS} : ${'[file]'.bold.yellow}${fileName}`);
        }

        mv.sync(from, to);

        cb();
    }))
    .on('end', () => {
        db = collect(db).map((ns) => {
            return collect(ns).filter((file) => {
                return fs.existsSync(path.resolve(`./${file.slice(0, 1)}/${file.slice(1, 2)}/${file}`));
            }).all();
        }).filter((ns) => ns.length).all();

        console.log('\nDB verified'.bold.cyan);

        jsonfile.writeFileSync('./db.json', db, {spaces: 2});
        console.log('DB saved'.bold.green);
    });