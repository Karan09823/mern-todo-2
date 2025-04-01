const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Mongodb connected..");
  })
  .catch((err) => {
    console.log("Failed to connect to db", err);
  });
