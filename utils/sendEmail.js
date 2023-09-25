const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { v4 } = require("uuid");
const { hashString } = require("./index.js");
const Verification = require("../models/emailVerification");

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

let transp = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

exports.sendVerificationEmail = async (user, res) => {
  const { _id, email, lastName } = user;
  const token = _id + v4();

  const link = APP_URL + "users/verify/" + _id + "/" + token;

  const options = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<div style='font-family: Arial, sans-serif; font-size:20px; color:#333;'
    <h1 style="color: rgb(8, 56, 188)"> 이메일을 인증해주세요!</h1>
    <hr>
    <h4>안녕하세요 ${lastName},</h4>
    <p> 
        이메일 본인인증을 부탁드립니다 (ㅡㅡ)
        <br>
    <p>이 링크의 <b> 유효시간은 한시간입니다.</p>
    <br>
    <a href=${link} 
    style="color: #fff; padding:14px; text-decoration:none; background-color: #000;">
    Email Address </a>
    </p>
    <div style="margin-top : 20px;">
    <h5>Best Regards</h5>
    <h5>Happy Luke</h5>
    </div>
    </div>`,
  };
  try {
    const hashedToken = await hashString(token);

    const verifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    if (verifiedEmail) {
      transp
        .sendMail(options)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message: "인증 메일이 전송 되었습니다. 이메일을 확인해주세요.",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: "Send Email Failed" });
        });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Request Failed" });
  }
};
