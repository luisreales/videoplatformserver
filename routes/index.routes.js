// const uuid = require('uuid').v4;
const express = require('express');
const router = express.Router();
const controller = require('../controller/index.controller');
const middleware = require('../middleware/index.middleware');

/**
 * 
 * Return an router with all the routes exposed for the client
 * @return {obj} *  
 * */


router.get('/getvideo/:id', controller.getListVideoById);
router.get('/listvideo', controller.getListVideo);
router.post('/uploadvideolocal', middleware.upload_local.single('file'),controller.postUploadLocal);

module.exports = router;

