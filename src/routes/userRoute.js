const express = require('express');
const app = express.Router();
const userController = require('../controllers/userController');
// const auth = require("../middleware/auth");

// Get
app.get("/",userController.getUsers);
app.get("/:id",userController.getUserById);
app.get("/username/:username",userController.getUserByUsername);

// Post
app.post("/login",userController.login);
app.post("/add",userController.addUser);

// Put
app.put("/update",userController.updateUser);

// Delete
app.delete("/delete/:id",userController.deleteUser);

module.exports = app;