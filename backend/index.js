const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./Models/db");

const PORT = process.env.PORT || 5000;

const app = express();
const todoRouter = require("./Routes/todoRouter");

// ✅ Apply CORS before defining routes
app.use(
  cors({
    origin: "https://mern-todo-ui.vercel.app", // Allow only your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api", todoRouter);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(PORT, () => {
  console.log(`server is running on port:${PORT}`);
});
