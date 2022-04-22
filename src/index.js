const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { append } = require("express/lib/response");
const express = require("express");
const router = express.Router();
const app = express();

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
    });

const userRoute = require('./routes/userRoute');
const artistRoute = require('./routes/artistRoute');
const songRoute = require('./routes/songRoute');

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user",userRoute);
app.use("/artist",artistRoute);
app.use("/song",songRoute);


app.listen(process.env.PORT, () => {
    console.log("sever listening port at", process.env.PORT);
});