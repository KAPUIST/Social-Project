const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (err) {
    console.log("DB Connection failed :" + err);
  }
};
module.exports = dbConnection;
