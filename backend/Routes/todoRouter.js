const {
  registerUser,
  signInUser,
  fetchUserById,
  addTask,
  updateTask,
  deleteTask,
  getTasks,
} = require("../Controllers/todoController");

const router = require("express").Router();

router.post("/signup", registerUser);
router.post("/login", signInUser);
router.post("/addTask", addTask);
router.put("/updateTask/:id", updateTask);
router.delete("deleteTask/:id", deleteTask);
router.get("/getTasks", getTasks);

router.get("/fetchUserById/:id", fetchUserById);

module.exports = router;
