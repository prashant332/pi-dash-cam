const fs = require('fs');
const find = require('lodash').find;
const findIndex = require('lodash').findIndex;
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
    dataCache['videos'].videos.push(videoObj);
    saveVideos(dataCache['videos']);
}

function getVideos() {
    return dataCache['videos'];
}

function markDontRemove(videoId, dontRemove) {
    const vid = getVideo(videoId);
    const index = findIndex(dataCache['videos'].videos, function(v){
        return v.id === Number(videoId);
    });
    console.log("video at index - "+ index);
    if(vid && index>-1){
        vid.dontRemove = dontRemove;
        dataCache['videos'].videos.splice(index, 1, vid);
        saveVideos(dataCache['videos']);
    }
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
    const video = find(dataCache['videos'].videos, function(vid){
        return vid.id === Number(videoId);
    });
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