const express = require('express');
const router = express.Router();
const checkDiskSpace = require('check-disk-space');
const settingsOperations = require('../db/redisClient');


/* GET users listing. */
router.get('/', function(req, res, next) {
    checkDiskSpace('/').then((diskSpace) =>{
        console.log(diskSpace);
        const freeSpace = (Number(diskSpace.free)/Number(diskSpace.size))*100;
        settingsOperations.getSettings().then((settings) => {
            res.render('setting', {availableSpace: freeSpace, settings:settings });
        });
    })
});

router.post('/save', function(req, res) {
    settingsOperations.updateSettings(req.body);
    res.redirect('/setting');
});

module.exports = router;
