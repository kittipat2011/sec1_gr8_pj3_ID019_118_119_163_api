const dotenv = require("dotenv");
const mysql = require("mysql2");
dotenv.config();

let Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

Connection.connect(function (err) {
    if (err) throw err;
});

exports.getArtists = (req,res) => {
    console.log("GET getArtists");
    Connection.query("SELECT * FROM artist ", function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            massage: "artists list"
        });
    });
}

exports.getArtistById = (req, res) => {
    console.log("GET getArtistByID");
    let artist = req.params.id;
    if (!artist) {
        return res.send({
            error: true,
            massage: "please provide artist id."
        });
    }

    Connection.query("SELECT * FROM artist WHERE ArtistID=?", artist, function (error, results) {
        if (error || results.length === 0)
            return res.send({
                error: true,
                massage: "artist is not found."
            });
        return res.send({
            error: false,
            data: results[0],
            massage: "artist retrieved."
        });
    });
};

exports.getArtistByName = (req, res) => {
    console.log("GET getArtistByName");
    let ArtistName = req.params.name;
    if (!ArtistName) {
        return res.send({
            error: true,
            massage: "please provide Artist Name."
        });
    }
    const sql = "SELECT * FROM artist WHERE ArtistName like '%"+ArtistName+"%'";

    Connection.query(sql, function (error, results) {
        if (error || results.length === 0)
            return res.send({
                error: true,
                massage: "Artist Name is not found."
            });
        return res.send({
            error: false,
            data: results,
            massage: "ArtistName retrieved."
        });
    });
};

exports.addArtist = (req, res) => {
    console.log("POST addArtist");
    let artist = req.body.artist
    let ArtistID = req.body.artist.ArtistID;
    console.log(artist);
    if (!artist) {
        return res.status(400).send({
            error: true,
            massage: "Please provide artist information",
        });
    }
    Connection.query("SELECT * FROM artist WHERE ArtistID=?", ArtistID, function (error, results) {
        if (error || results.length === 0){
            Connection.query("INSERT INTO artist SET?", artist, function (error, results) {
                if (error) throw error;
                return res.send({
                    error: false,
                    data: results.affectedRows,
                    massage: "add done!",
                });
            });
        }else{
            return res.send({
                error: false,
                massage: "Duplicate ID."
            });
        }
    });

};


exports.updateArtist = (req, res) => {
    console.log("PUT updateArtist");
    let artist_ID = req.body.artist.ArtistID;
    let artist = req.body.artist;

    if (!artist_ID || !artist) {
        return res.status(400).send({
            error: true,
            message: "Please provide Artist ID"
        });
    }

    Connection.query("UPDATE artist SET ? WHERE ArtistID=?", [artist, artist_ID], function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "Artist ID has been updated successfully."
        });
    });
};

exports.deleteArtist = (req, res) => {
    console.log("DELETE deleteArtist");
    let ArtistID = req.params.id;

    if (!ArtistID) {
        return res.status(400).send({
            error: true,
            message: "Please provide ArtistID"
        });
    }

    Connection.query("DELETE FROM artist WHERE ArtistID=?", ArtistID, function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "ArtistID has been deleted successfully."
        });
    });
};


