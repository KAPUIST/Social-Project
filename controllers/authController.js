const Users = require("../models/userSchema.js");
const { hashString, comparePassword, createJWT } = require("../utils/index.js");
const { sendVerificationEmail } = require("../utils/sendEmail.js");
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //유효성
  if (!firstName || !lastName || !email || !password) {
    console.log(req.body);
    next("Require fields");
    return;
  }

  try {
    const userExists = await Users.findOne({ where: { email } });
    if (userExists) {
      next("Email Address already exists");
      return;
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    sendVerificationEmail(user, res);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      next("정보를 모두 입력해주세요.");
      return;
    }

    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });
    if (!user) {
      next("이메일 또는 비밀번호가 정확하지않습니다.");
      return;
    }
    if (!user.verified) {
      next("이메일 인증이 필요합니다.");
      return;
    }

    const comparePW = await comparePassword(password, user?.password);

    if (!comparePW) {
      next("이메일 또는 비밀번호가 정확하지않습니다.");
      return;
    }
    user.password = undefined;
    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "로그인 성공!",
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};
