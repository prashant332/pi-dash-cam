const laterObj = require('later');
const dbOps = require('../db/redisClient');
const checkDiskSpace = require('check-disk-space');
const { CAPTURE_DIRECTORY } = require('../constants');
const spawn = require('child_process').spawn;
let PROCESS_RUNNING = false;
let child_process = undefined;
let videoTimer = undefined;

function startVideo() {
    if(!videoTimer){
        dbOps.getSettings().then(settings => {
            startCapture(settings);
            videoTimer = laterObj.parse.text(`every ${settings.looptime}}`);
            laterObj.setInterval(function() {
                startCapture(settings);
            }, videoTimer);
        });
    }
}

function startCapture(settings) {
    const videoSettings = getVideoSettings(settings);
    dbOps.getNextVideoId().then(vidId => {
        const vidFile = `${CAPTURE_DIRECTORY}/vid_${vidId}.h264`;
        const thumbnail = `${CAPTURE_DIRECTORY}/thumb_${vidId}.jpg`;
        if(PROCESS_RUNNING && child_process) {
            child_process.kill('SIGINT');
            child_process = undefined;
            PROCESS_RUNNING = false;
        }
        const raspistillCommand = `/opt/vc/bin/raspivid`;
        child_process = spawn('raspistill', ['-t', '10', '-n', '-w', '640', '-h', '480', '-ex', 'sports', '-o', thumbnail]);
        child_process.on('exit', function() {
            child_process = spawn(raspistillCommand, ['-t', '0','-n', '-w', videoSettings.width, '-h', videoSettings.height, '-rot', videoSettings.rotation, '-awb', videoSettings.awb, '-o', vidFile]);
        });
        PROCESS_RUNNING = true;
        child_process.stderr.on('data', function(data) {
            console.log("process error -> "+ data);
        });
        child_process.stdout.on('data', function (data) {
            console.log("process data "+ data);
        });
        dbOps.createVideo({id: vidId, thumbnail: thumbnail, path: vidFile, title: `vid_${vidId}.h264`, dontRemove: false});
        checkDiskSpace('/').then((diskSpace) =>{
            const freeSpace = (Number(diskSpace.free)/Number(diskSpace.size))*100;
            if(freeSpace<20){
                cleanUpVideo();
            }
        });
    });
}

function cleanUpVideo() {
    dbOps.getVideos().then(videos => {
        const vidToRemove = videos[0];
        if(vidToRemove){
            dbOps.deleteVideo(vidToRemove.id);
        }
    });
}

function getVideoSettings(settingObj) {
    const settings = {};
    if(settingObj.quality === 'Auto'){
        settings.width='auto';
        settings.height='auto'
    } else{
        const dimension = settingObj.quality.split('x');
        settings.width = dimension[0];
        settings.height = dimension[1];
    }
    settings.rotation =  settingObj.rotation;
    settings.awb =  settingObj.whitebalance;
    return settings;
}

module.exports = {
    init: startVideo,
    clean: cleanUpVideo
};