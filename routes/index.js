const express = require("express");
const authRouter = require("./authRoutes");
const userRouter = require("./userRoutes");
const router = express.Router("/api");

router.use(`/auth`, authRouter); // api/auth/router
router.use("/users", userRouter);
module.exports = router;
