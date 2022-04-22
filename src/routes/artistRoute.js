const express = require('express');
const app = express.Router();
const artistController = require('../controllers/artistController')

//Get
app.get("/",artistController.getArtists);
app.get("/:id",artistController.getArtistById);
app.get("/name/:name",artistController.getArtistByName);

//Post
app.post("/add",artistController.addArtist);

//Put
app.put("/update",artistController.updateArtist);

//Delete
app.delete("/delete/:id",artistController.deleteArtist);


module.exports = app;