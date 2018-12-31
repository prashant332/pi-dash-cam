const Redis = require('ioredis');
const redis = new Redis();
const isEmpty = require('lodash').isEmpty;

function init(){

    redis.exists('videoIdCounter').then(result => {
        if(result === 0){
            redis.set('videoIdCounter', 0);
            redis.sadd('videoKeys', 0);
        }
    });

    redis.exists('settings').then(result => {
        if(result === 0){
            redis.hmset('settings', 'pause', 'off', 'videoOptions', '', 'quality', '640x480', 'rotation', 0, 'whitebalance', 'auto', 'looptime', '3 mins', 'stabilization', 'on');
        }
    });
}

async function nextVideoId(){
    redis.incr('videoIdCounter');
    const id = await redis.get('videoIdCounter', (err, result) => {
        return result;
    });
    redis.sadd('videoKeys', id);
    return id;
}

function createVideo(videoObject){
    const id = videoObject.id;
    redis.hmset(`vid:${id}`, 'id', id, 'title', videoObject.title, 'path', videoObject.path, 'thumbnail', videoObject.thumbnail, 'dontRemove', false);
}

async function getVideos() {
    const members = await redis.smembers('videoKeys', (err, result) => {
        return result;
    });
    const videos = [];
    for(var i=members.length;i>=0;i--) {
        const video = await redis.hgetall(`vid:${members[i]}`, (err, result)=>{
            return result;
        });
        if(!isEmpty(video)) {
            videos.push(video);
        }
    }
    return videos;
}

async function getVideo(videoId) {
    const video = await redis.hgetall(`vid:${videoId}`, (err, result) => {
        return result;
    });
    return video;
}

function updateDontRemove(videoId, flag) {
    redis.hset(`vid:${videoId}`, 'dontRemove', flag);
}

function deleteVideo(videoId) {
    redis.hdel(`vid:${videoId}`,'id', 'title', 'path', 'thumbnail', 'dontRemove');
    redis.srem('videoKeys', videoId);
}

async function getSettings() {
    const setting = await redis.hgetall('settings', (err, result)=> {
        return result;
    });
    return setting;
}

function updateSettings(settingsObj){
    redis.hmset('settings', 'pause', settingsObj.pause, 'videoOptions',
        settingsObj.videoOptions, 'quality', settingsObj.quality,
        'rotation', settingsObj.rotation, 'whitebalance', settingsObj.whitebalance, 'looptime',
        settingsObj.loopTime, 'stabilization', settingsObj.stabilization);
}

module.exports = {
    getNextVideoId: nextVideoId,
    createVideo: createVideo,
    getVideos: getVideos,
    getVideo: getVideo,
    updateDontRemoveFlag: updateDontRemove,
    deleteVideo: deleteVideo,
    getSettings: getSettings,
    updateSettings: updateSettings,
    init: init
};