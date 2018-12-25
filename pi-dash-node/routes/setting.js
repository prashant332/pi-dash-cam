var express = require('express');
var router = express.Router();
const checkDiskSpace = require('check-disk-space');
const settingsOperations = require('../db/dbOperations');


/* GET users listing. */
router.get('/', function(req, res, next) {
    checkDiskSpace('/').then((diskSpace) =>{
        console.log(diskSpace);
        const freeSpace = (Number(diskSpace.free)/Number(diskSpace.size))*100;
        res.render('setting', {availableSpace: freeSpace, settings: settingsOperations.getSettings()});
    })
});

router.post('/save', function(req, res) {
    settingsOperations.updateSettings(req.body);
    res.redirect('/setting');
});

module.exports = router;
