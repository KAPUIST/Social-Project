const mongoose = require("mongoose");
const Verification = require("../models/emailVerification");
const Users = require("../models/userSchema");
const { comparePassword } = require("../utils");

exports.verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const data = await Verification.findOne({ userId });

    if (data) {
      const { expiresAt, token: hashedToken } = data;

      //토큰 기한 체크
      if (expiresAt < Date.now()) {
        await Verification.findOneAndDelete({ userId })
          .then(() => {
            const message = "토큰이 만료되었습니다.";
            res.redirect(`/users/verified?status=error&message=${message}`);
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/users/verified?status=error&message=`);
          });
      } else {
        //토큰 기한 남아있을때
        comparePassword(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              Users.findOneAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = "이메일 인증이 완료되었습니다.";
                    res.redirect(
                      `/users/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = "이메일 인증이 실패하였습니다.";
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              //일치하지 않는 토큰 일경우
              const message = "이메일 인증이 실패하였습니다.";
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/users/verified?status=error&message=`);
          });
      }
    } else {
      const message = "처리할수 없는 요청입니다.";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (err) {
    const message = "처리할수 없는 요청입니다.";
    res.redirect(`/users/verified?status=error&message=${message}`);
  }
};
