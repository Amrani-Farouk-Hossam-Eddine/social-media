const db = require("../connect");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const getComments = (req, res) => {
  const q =
    "SELECT c.*, u.id AS userId, profilePic, name FROM comments AS c JOIN users AS u ON (c.userId = u.id) WHERE postId = ?";
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};

const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "INSERT INTO comments (`desc`, `postId`, `userId`, `createdAt`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.postId,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("comment created");
    });
  });
};

const deleteComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q = "DELETE FROM comments WHERE userId = ? AND id = ?";
    db.query(q, [userInfo.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("comment deleted");
    });
  });
};

module.exports = { getComments, addComment, deleteComment };
