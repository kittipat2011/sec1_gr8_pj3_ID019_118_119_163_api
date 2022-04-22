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

exports.getSongs = (req, res) => {
    console.log("GET getSongs");
    Connection.query("SELECT * FROM song ", function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            massage: "songs list"
        });
    });
};

exports.getSongById = (req, res) => {
    console.log("GET getSongById");
    let SongID = req.params.id;
    if (!SongID) {
        return res.send({
            error: true,
            massage: "please provide SongID."
        });
    }

    Connection.query("SELECT * FROM song WHERE SongID=?", SongID, function (error, results) {
        if (error || results.length === 0)
            return res.send({
                error: true,
                massage: "SongID is not found."
            });
        return res.send({
            error: false,
            data: results[0],
            massage: "Song retrieved."
        });
    });
};

exports.getSongByName = (req, res) => {
    console.log("GET getSongByName");
    let SongName = req.params.name;
    if (!SongName) {
        return res.send({
            error: true,
            massage: "please provide SongName."
        });
    }

    const sql = "SELECT * FROM song WHERE SongName like '%"+SongName+"%'";

    Connection.query(sql, function (error, results) {
        if (error || results.length === 0)
            return res.send({
                error: true,
                massage: "SongName is not found."
            });
        return res.send({
            error: false,
            result: results,
            massage: "Song retrieved."
        });
    });
};

exports.addSong = (req, res) => {
    console.log("POST addSong");
    let song = req.body.song
    let SongID = req.body.song.SongID;
    console.log(song);
    if (!song) {
        return res.status(400).send({
            error: true,
            massage: "Please provide song information",
        });
    }
    Connection.query("SELECT * FROM song WHERE SongID=?", SongID, function (error, results) {
        if (error || results.length === 0){
            Connection.query("INSERT INTO song SET?", song, function (error, results) {
                if (error) throw error;
                return res.send({
                    error: false,
                    data: results.affectedRows,
                    massage: "add done!",
                });
            });
        }else{
            return res.send({
                error: true,
                massage: "Duplicate ID."
            });
        }
    });

};

exports.updateSong = (req, res) => {
    console.log("PUT updateSong");
    let song_id = req.body.song.SongID;
    let song = req.body.song;

    if (!song_id || !song) {
        return res.status(400).send({
            error: true,
            message: "Please provide Song ID"
        });
    }

    Connection.query("UPDATE song SET ? WHERE SongID=?", [song, song_id], function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "Song ID has been updated successfully."
        });
    });
};

exports.deleteSong = (req, res) => {
    console.log("DELETE deleteSong");
    let SongID = req.params.id;

    if (!SongID) {
        return res.status(400).send({
            error: true,
            message: "Please provide SongID"
        });
    }

    Connection.query("DELETE FROM song WHERE SongID=?", SongID, function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "SongID has been deleted successfully."
        });
    });
};