const express = require("express");
const router = express.Router();
const textController = require("../controllers/textController");
const rateLimiter = require("../middleware/rateLimiter");

router.post("/summarize", rateLimiter, textController.summarize);
router.post("/simplify", rateLimiter, textController.simplify);
router.post("/examples", rateLimiter, textController.examples);
router.post("/videos", rateLimiter, textController.videos);

module.exports = router;
