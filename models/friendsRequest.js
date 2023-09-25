const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: "Users" },
    requestFrom: { type: Schema.Types.ObjectId, ref: "Users" },
    requestStatus: { type: String, defaul: "Pending" },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model("FriendRequest", requestSchema);

module.exports = FriendRequest;
