const express = require("express");
const { verifyEmail } = require("../controllers/userController.js");
const path = require("path");

const userRouter = express.Router();

const __test = path.resolve(path.dirname(""));

userRouter.get("/verify/:userId/:token", verifyEmail);

userRouter.get("/verified", (req, res) => {
  res.sendFile(path.join(__test, "./views/build", "index.html"));
});

module.exports = userRouter;
