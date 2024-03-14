const express = require("express");
const router = express.Router();
const {
  getPosts,
  addPost,
  deletePost,
} = require("../controllers/posts.controller");

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/", deletePost);

module.exports = router;
