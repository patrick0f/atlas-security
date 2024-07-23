const express = require("express");

const {
    getTopScores,
    createScore } = require("../controllers/scores");

const router = express.Router();

router.route('/').get(getTopScores).post(createScore);

module.exports = router;