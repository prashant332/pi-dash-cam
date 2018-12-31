const express = require('express');
const fs = require('fs');
const router = express.Router();
const dataOps = require('../db/redisClient');


/* GET users listing. */
router.get('/', function(req, res, next) {
    dataOps.getVideos().then((videos)=>{
        res.render('videos', {videos: videos} );
    });
});

router.get('/play/:videoId', function (req, res) {
    res.render('play', {id: req.params.videoId});
});

router.get('/stream/:videoId', function(req, res) {
    dataOps.getVideo(req.params.videoId).then((video)=>{
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
});

router.get('/delete/:videoId', function(req, res) {
    dataOps.getVideo(req.params.videoId).then((vid)=> {
        if(vid) {
            const path = vid.path;
            dataOps.deleteVideo(vid.id);
            fs.unlinkSync(path);
            res.redirect("/videos");
        } else {
            res.writeHead(404);
            res.send("File not found");
        }
    })
});

router.get('/updateRemoveFlag/:videoId/:status', function(req,res){
    const vidId = req.params.videoId;
    const status = req.params.status;
    if(vidId) {
        dataOps.updateDontRemoveFlag(vidId, status);
        res.redirect("/videos");
    } else {
        res.writeHead(404);
        res.send("File not found");
    }
});

router.get('/download/:videoId', function(req, res) {
    dataOps.getVideo(req.params.videoId).then((video)=>{
        const path = video.path;
        res.download(path);
    });
});

router.get('/thumbnail/:videoId', function(req,res){
    dataOps.getVideo(req.params.videoId).then(video =>{
        if(video) {
            res.download(video.thumbnail);
        } else {
            res.writeHead(404);
            res.send("File not found");
        }
    });
});

module.exports = router;
