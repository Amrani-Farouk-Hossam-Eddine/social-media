const moment = require("moment/moment");
const db = require("../connect");
const jwt = require("jsonwebtoken");

const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      userId !== "undefined"
        ? "SELECT p.*, u.id AS userId, u.profilePic, u.name  FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC"
        : "SELECT p.*, u.id AS userId, u.profilePic, u.name  FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC";
    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(data);
    });
  });
};

const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "INSERT INTO posts (`desc`, `img`, `userId`, `createdAt`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:ss:mm"),
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Post has been created");
    });
  });
};

const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q = "DELETE FROM posts WHERE userId = ? AND id = ?";
    db.query(q, [userInfo.id, req.query.id], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Post has been deleted");
    });
  });
};

module.exports = { getPosts, addPost, deletePost };
