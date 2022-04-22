const express = require('express');
const app = express.Router();
const songController = require('../controllers/songController');

//Get
app.get("/",songController.getSongs);
app.get("/:id",songController.getSongById);
app.get("/name/:name",songController.getSongByName);

//Post
app.post("/add",songController.addSong);

//Put
app.put("/update",songController.updateSong);

//Delete
app.delete("/delete/:id",songController.deleteSong);

module.exports = app;