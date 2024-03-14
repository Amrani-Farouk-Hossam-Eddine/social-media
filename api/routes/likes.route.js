const express = require("express");
const router = express.Router();
const {
  getLikes,
  addLike,
  deleteLike,
} = require("../controllers/likes.controller");

router.get("/", getLikes);
router.post("/", addLike);
router.delete("/", deleteLike);

module.exports = router;
