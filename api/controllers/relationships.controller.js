const db = require("../connect");
const jwt = require("jsonwebtoken");

const getRelationships = (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};

const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?)";
    const values = [userInfo.id, req.query.followedUserId];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("follow");
    });
  });
};

const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
    db.query(q, [userInfo.id, req.query.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("unfollow");
    });
  });
};
module.exports = { getRelationships, addRelationship, deleteRelationship };
