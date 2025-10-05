const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "/public/views"));

const base_url = "http://localhost:3000"

// Page Register
app.get("/", (req, res) => {
    try {
        return res.render("Register");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error get Register");
    }
});

app.post("/POST_Person", async (req, res) => {
    try {
        const {username, password, email} = req.body;

        const data = {
            username: username,
            password: password,
            email: email 
        } 

        const response = await axios.post(base_url + "/person", data)
        return res.render("Register", {success: response.data?.success, error: response.data?.error});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error post Register")
    }
})

app.listen(5500, () => console.log(`Employee_Management_front-end: http://localhost:5500`));