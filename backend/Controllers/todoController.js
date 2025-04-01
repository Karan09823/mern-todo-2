const express = require("express");
const User = require("../Models/user");
const List = require("../Models/list");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const router = express.Router();
const saltRounds = 10;

//authentication controller --------------------------------------------------------------------------------------------begin

// Sign up
const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashpassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, username, password: hashpassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Sign in
const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Please Sign up First" });

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Password is not correct" });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch user by ID
const fetchUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "Invalid user id" });

    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

// List Controller --------------------------------------------------------------------------------------------------

// Add Task
const addTask = async (req, res) => {
  try {
    const { title, body, email } = req.body;
    if (!email || !title || !body)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const list = new List({ title, body, user: existingUser._id });
    existingUser.list.push(list);

    await Promise.all([list.save(), existingUser.save()]);
    res.status(200).json({ list });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const { id } = req.params;
    if (!email || !title || !body)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User does not exist" });

    const task = await List.findOne({ _id: id, user: existingUser._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = title;
    task.body = body;
    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Task ID" });

    const existingUser = await User.findById(userId);
    if (!existingUser)
      return res.status(404).json({ message: "User does not exist" });

    const task = await List.findOneAndDelete({ _id: id, user: userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await User.updateOne({ _id: userId }, { $pull: { list: id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Task List
const getTasks = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "Invalid user ID" });

    const list = await List.find({ user: id }).sort({ createdAt: -1 });
    if (list.length === 0)
      return res.status(204).json({ message: "Empty task list" });

    res.status(200).json({ list });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  signInUser,
  fetchUserById,
  addTask,
  updateTask,
  deleteTask,
  getTasks,
};
