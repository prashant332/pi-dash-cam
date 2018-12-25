var express = require('express');
const fs = require('fs');
var router = express.Router();
const dbOps = require('../db/dbOperations');
const sortBy = require('lodash').sortBy;
const { CAPTURE_DIRECTORY } = require('../constants');


/* GET users listing. */
router.get('/', function(req, res, next) {
    const videos = dbOps.getVideos().videos;
    res.render('videos', {videos: sortBy(videos, ['id'], ['desc'])});
});

router.get('/download/:videoId', function(req, res) {
    const video = dbOps.getVideo(req.params.videoId);
    const path = `${CAPTURE_DIRECTORY}/${video.title}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if(range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res)
    }
    res.redirect('/setting');
});

router.get('/thumbnail/:videoId', function(req,res){
    const video = dbOps.getVideo(req.params.videoId);
    if(video) {
        const path = `${CAPTURE_DIRECTORY}/${video.thumbnail}`;
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'application/jpg',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    } else {
        res.writeHead(404);
        res.send("File not found");
    }
});

module.exports = router;
