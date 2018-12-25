const laterObj = require('later');
const dbOps = require('../db/dbOperations');
const checkDiskSpace = require('check-disk-space');
const sortBy = require('lodash').sortBy;
var RaspiCam = require('raspicam');
const { CAPTURE_DIRECTORY } = require('../constants');
var snapshotCam = undefined;
var videoCam = undefined;

let videoTimer = laterObj.parse.text(`every ${dbOps.getSettings()["loopTime"]}`);

function startVideo() {
   startCapture();
    laterObj.setInterval(function() {
       startCapture();
   }, videoTimer);
}

function startCapture() {
    const settings = dbOps.getSettings();
    const vidId = dbOps.getNextVideoId();
    const videoSettings = getVideoSettings(settings);
    const vidFile = `${CAPTURE_DIRECTORY}/vid_${vidId}.h264`;
    const thumbnail = `${CAPTURE_DIRECTORY}/thumb_${vidId}.jpg`;
    if(videoCam) {
        videoCam.stop();
    }
    videoCam = new RaspiCam({mode: 'video', output:vidFile});
    snapshotCam = new RaspiCam({mode: 'photo', output: thumbnail});
    snapshotCam.set('t', '10');
    snapshotCam.set('n', '');
    snapshotCam.start();
    snapshotCam.on('exit', function() {
        videoCam.set('t', "0");
        videoCam.set('w', videoSettings.width);
        videoCam.set('h', videoSettings.height);
        videoCam.set('rot', videoSettings.rotation);
        videoCam.set('awb', videoSettings.awb);
        videoCam.start();
    });
    dbOps.saveVideo({id: vidId, thumbnail: thumbnail, path: vidFile, title: `vid_${vidId}.h264`, dontRemove: false});
    checkDiskSpace('/').then((diskSpace) =>{
        const freeSpace = (Number(diskSpace.free)/Number(diskSpace.size))*100;
        if(freeSpace<20){
            cleanUpVideo();
        }
    });
}

function cleanUpVideo() {
    console.log("Cleaning videos");
    const videos = dbOps.getVideos().videos;
    const sortedVideos = sortBy(videos, ['id']);
    const vidToRemove = sortedVideos[sortedVideos.length-1];
    if(vidToRemove){
        dbOps.deleteVideo(vidToRemove);
    }
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