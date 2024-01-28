const express = require("express");
const router = express.Router();
const gptController = require("../controllers/gptController");
const googleCloudController = require('../controllers/googleCloudController')

router.post('/gpt/find_mood_score', gptController.get_mood_score);

module.exports = router;