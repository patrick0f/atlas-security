const express = require("express");
const router = express.Router();

const getRSS = require("../controllers/rss");

router.route("/").get(getRSS)

module.exports = router;