'use strict';

const map = require('map-stream');
const vfs = require('vinyl-fs');
const mv = require('mv');
const path = require('path');
const fs = require('fs');

vfs.src(['./*.{jpg,png,gif}'])
    .pipe(map((file, cb) => {
        let filename = path.basename(file.path);
        let from = `./${filename}`;
        let to = `./${filename.slice(0, 1)}/${filename.slice(1, 2)}/${filename}`;
        mv(from, to, {mkdirp: true, clobber: false}, function (err) {
            if (err && err.code === 'EEXIST') {
                console.info(`[ignored] ${to} has been exists`)
            }
            cb();
        });
    }));