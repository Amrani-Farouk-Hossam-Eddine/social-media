const express = require("express");
const router = express.Router();
const {
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/comment.controller");

router.get("/", getComments);
router.post("/", addComment);
router.delete("/:id", deleteComment);

module.exports = router;
