const express = require('express');
const router = express.Router();
const  User = require('../user/controller')

router.post('/file/upload/', [], User.uploadFiles)
router.get('/data/', [], User.getData)
router.delete('/data/', [], User.deleteAllData)

module.exports = router;

