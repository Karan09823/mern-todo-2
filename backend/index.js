const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./Models/db");

const PORT = process.env.PORT || 5000;

const app = express();
const todoRouter = require("./Routes/todoRouter");

app.use("/api", todoRouter);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(PORT, () => {
  console.log(`server is running on port:${PORT}`);
});
