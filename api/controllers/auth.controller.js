const db = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists");
    const q = "INSERT INTO users (username, password, email, name) VALUES (?)";
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const values = [
      req.body.username,
      hashedPassword,
      req.body.email,
      req.body.name,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("user has been created");
    });
  });
};

const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");
    const valid = bcrypt.compareSync(req.body.password, data[0].password);
    if (!valid) return res.status(400).json("Wrong password or username");
    const token = jwt.sign({ id: data[0].id }, process.env.SECRET_KEY);
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(data);
  });
};

const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("logout");
};

module.exports = { register, login, logout };
