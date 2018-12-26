var express = require('express');
const fs = require('fs');
var router = express.Router();
const dbOps = require('../db/dbOperations');
const sortBy = require('lodash').sortBy;


/* GET users listing. */
router.get('/', function(req, res, next) {
    const videos = dbOps.getVideos().videos;
    res.render('videos', {videos: sortBy(videos, ['id'], ['desc'])});
});

router.get('/play/:videoId', function (req, res) {
    console.log(">>>>>get video for "+req.params.videoId);
    res.render('play', {id: req.params.videoId});
});

router.get('/stream/:videoId', function(req, res) {
    console.log(">>>>>get video for download "+req.params.videoId);
    const video = dbOps.getVideo(req.params.videoId);
    const path = video.path;
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
            'Content-Type': 'video/h264',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/h264',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res)
    }
});

router.get('/delete/:videoId', function(req, res) {
    const vid = dbOps.getVideo(req.params.videoId);
    if(vid) {
        const path = vid.path;
        dbOps.deleteVideo(vid);
        fs.unlinkSync(path);
        res.redirect("/videos");
    } else {
        res.writeHead(404);
        res.send("File not found");
    }
});

router.get('/updateRemoveFlag/:videoId/:status', function(req,res){
    const vidId = req.params.videoId;
    const status = req.params.status;
    if(vidId) {
        dbOps.markDontRemove(vidId, status);
        res.redirect("/videos");
    } else {
        res.writeHead(404);
        res.send("File not found");
    }
});

router.get('/download/:videoId', function(req, res) {
    console.log(">>>>>get video for download "+req.params.videoId);
    const video = dbOps.getVideo(req.params.videoId);
    const path = video.path;
    res.download(path);
});

router.get('/thumbnail/:videoId', function(req,res){
    const video = dbOps.getVideo(req.params.videoId);
    if(video) {
        res.download(video.thumbnail);
    } else {
        res.writeHead(404);
        res.send("File not found");
    }
});

module.exports = router;
