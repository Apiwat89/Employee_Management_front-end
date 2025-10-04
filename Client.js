const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const path = require('path');

const base_url = "http://localhost:5500"

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "/public/views"));

app.get("/", (req, res) => {
    try {
        res.send("Hello Word!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error Home");
    }
});

app.listen(5500, () => {console.log(`Employee_Management_front-end: ${base_url}`)});