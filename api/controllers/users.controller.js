const db = require("../connect");
const jwt = require("jsonwebtoken");

const getUser = (req, res) => {
  const userId = req.params.id;
  const q = "SELECT * FROM users WHERE id = ?";
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    res.status(200).json(info);
  });
};

const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");
    const q =
      "UPDATE users SET name = ?, website = ?, city = ?, coverPic = ?, profilePic = ? WHERE id = ?";
    db.query(
      q,
      [
        req.body.name,
        req.body.website,
        req.body.city,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("user updated");
      }
    );
  });
};

module.exports = { getUser, updateUser };
