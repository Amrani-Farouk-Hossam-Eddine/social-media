const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth.route");
const usersRoute = require("./routes/users.route");
const postsRoute = require("./routes/posts.route");
const likesRoute = require("./routes/likes.route");
const commentsRoute = require("./routes/comments.route");
const relationshipsRoute = require("./routes/relationships.route");
const multer = require("multer");

dotenv.config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/likes", likesRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/relationships", relationshipsRoute);

app.listen(8800, () => {
  console.log("API is working");
});
