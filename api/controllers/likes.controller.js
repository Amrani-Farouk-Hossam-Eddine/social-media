const db = require("../connect");
const jwt = require("jsonwebtoken");

const getLikes = (req, res) => {
  const q = "SELECT userId FROM likes WHERE postId = ?";
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data.map((like) => like.userId));
  });
};

const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q = "INSERT INTO likes (userId, postId) VALUES (?)";
    const values = [userInfo.id, req.body.postId];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Post has been liked");
    });
  });
};

const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q = "DELETE FROM likes WHERE userId = ? AND postId = ?";
    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Post has been unliked");
    });
  });
};

module.exports = { getLikes, addLike, deleteLike };
