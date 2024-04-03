const express = require('express');
const router = express.Router();
const averageController = require('../controller/averageController');

router.get('/numbers/:qualifier', averageController.processRequest);

module.exports = router;
