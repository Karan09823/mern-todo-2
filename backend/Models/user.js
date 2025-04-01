const mongoose = require("mongoose");

const List = require("./list");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  ["deleteOne", "deleteMany"],
  { document: true, query: false },
  async function (next) {
    try {
      const users = await this.model.find(this.getFilter());
      for (const user of users) {
        await List.deleteMany({ user: user._id });
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mongoose.model("User", userSchema);
