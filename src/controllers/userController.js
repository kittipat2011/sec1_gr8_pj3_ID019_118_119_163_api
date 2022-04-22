const dotenv = require("dotenv");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
dotenv.config();

// Database Connecttion
let Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

Connection.connect(function (err) {
    if (err) throw err;
});

// All function
exports.getUsers = (req, res) => {
    console.log("GET getUsers");
    Connection.query("SELECT * FROM user_information ", function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            massage: "user_information  list"
        });
    });
};

exports.getUserById = (req, res) => {
    console.log("GET getUserById");
    let UserID = req.params.id;
    if (!UserID) {
        return res.send({
            error: true,
            massage: "please provide UserID."
        });
    }

    Connection.query("SELECT * FROM user_information WHERE UserID=?", UserID, function (error, results) {
        if (error || results.length === 0)
            return res.send({
                error: true,
                massage: "UserID is not found."
            });
        return res.send({
            error: false,
            data: results[0],
            massage: "User retrieved."
        });
    });
};

exports.getUserByUsername = (req, res) => {
    console.log("GET getUserByUsername");
    let Username = req.params.username;
    if (!Username) {
        return res.send({
            error: true,
            massage: "please provide Username."
        });
    }
    
    Connection.query("SELECT * FROM user_information WHERE UserName=?", Username, function (error, results) {
        if (error || results.length === 0)
            return res.send({
                error: true,
                massage: "Username is not found."
            });
        return res.send({
            error: false,
            data: results,
            massage: "User retrieved."
        });
    });
};

exports.addUser = (req, res) => {
    console.log("POST addUser");
    let user_information = req.body.user
    let userID = req.body.user.UserID
    console.log(user_information);
    if (!user_information) {
        return res.status(400).send({
            error: true,
            massage: "Please provide user information",
        });
    }
    Connection.query("SELECT * FROM user_information WHERE UserID=?", userID, function (error, results) {
        if (error || results.length === 0){
            Connection.query("INSERT INTO user_information SET?", user_information, function (error, results) {
                if (error) throw error;
                return res.send({
                    error: false,
                    data: results.affectedRows,
                    massage: "ok",
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

exports.login = (req,res) => {
    console.log("POST login");
    let email = req.body.email;
    let password = req.body.password;

    let sql = "select * FROM user_information WHERE Email='"+email+"' AND UserPassword='"+password+"'";

    Connection.query(sql, function (error, result) {
        if (error) throw error;

        if(result != 0){

            let token = jwt.sign({
                result
            }, "secret", {
                expiresIn: 604800
            });

            return res.send({
                token: token,
                result: result,
                message: "login successfully."
            });
        }else{
            return res.send({
                message: "login failed."
            });
        }
    });
}

exports.updateUser = (req, res) => {
        console.log("PUT updateUser");
        let user_id = req.body.user.UserID;
        let user = req.body.user;
    
        if (!user_id|| !user ) {
            return res.status(400).send({
                error: true,
                message: "Please provide User ID"
            });
        }
    
        Connection.query("UPDATE user_information SET ? WHERE UserID=?", [user, user_id], function (error, results) {
            if (error) throw error;
            return res.send({
                error: false,
                data: results.affectedRows,
                message: "User ID has been updated successfully."
            });
        });
};

exports.deleteUser = (req, res) => {
    console.log("DELETE deleteUser");   
    let UserID = req.params.id;
    if (!UserID) {
        return res.status(400).send({
            error: true,
            message: "Please provide userID"
        });
    }

    Connection.query("DELETE FROM user_information WHERE UserID=?", UserID, function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results.affectedRows,
            message: "UserID has been deleted successfully."
        });
    });
};