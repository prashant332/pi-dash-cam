const fs = require('fs');
const find = require('lodash').find;
const merge = require('lodash').merge;
const remove = require('lodash').remove;
const dataCache = {};

dataCache['videos'] = JSON.parse(fs.readFileSync('db/videos.json'));

function getSettings() {
    if(!dataCache['settings']){
        const settingData = fs.readFileSync('db/setting.json');
        dataCache['settings'] = JSON.parse(settingData);
    }
    return dataCache["settings"];
}

function updateSettings(settingsObject) {
    fs.writeFileSync('db/setting.json', JSON.stringify(settingsObject));
    dataCache['settings'] = undefined;
}

function saveVideos(videoobject) {
    fs.writeFileSync('db/videos.json', JSON.stringify(videoobject));
}

function getNextVideoId() {
    let currentId = dataCache['videos'].lastId;
    dataCache['videos'].lastId = currentId+1;
    saveVideos(dataCache['videos']);
    return currentId;
}

function saveVideo(videoObj) {
    merge(dataCache['videos'].videos, videoObj);
    saveVideos(dataCache['videos']);
}

function getVideos() {
    return dataCache['videos'];
}

function markDontRemove(videoId, dontRemove) {
    const vid = find(dataCache['videos'].videos, {id: videoId});
    if(vid){
        vid.dontRemove = dontRemove;
    }
    saveVideo(vid);
}
function deleteVideo(videoObj){
    remove(dataCache['videos'].videos, function(vid){
        return vid.id === videoObj.id;
    });
    saveVideos(dataCache.videos);
    fs.unlinkSync(videoObj.path);
    fs.unlinkSync(videoObj.thumbnail);
}
function getVideo(videoId) {
    const video = find(dataCache['videos'].videos, {id: videoId});
    return video;
}

module.exports = {
    getSettings: getSettings,
    updateSettings: updateSettings,
    getNextVideoId: getNextVideoId,
    saveVideo: saveVideo,
    getVideos: getVideos,
    markDontRemove: markDontRemove,
    deleteVideo: deleteVideo,
    getVideo: getVideo
}