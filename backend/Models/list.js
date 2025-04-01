const mongoose = require("mongoose");
const User = require("./user");

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

listSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await User.findByIdAndUpdate(this.user, { $pull: { list: this._id } });
      next();
    } catch (error) {
      next(error);
    }
  }
);



module.exports = mongoose.model("List", listSchema);