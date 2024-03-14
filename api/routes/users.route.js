const express = require("express");
const router = express.Router();
const { getUser, updateUser } = require("../controllers/users.controller");

router.get("/find/:id", getUser);
router.put("/", updateUser);

module.exports = router;
