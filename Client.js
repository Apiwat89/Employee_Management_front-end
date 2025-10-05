const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "/public/views"));
app.use(cookieParser());

const base_url = "http://localhost:3000";

app.get("/", (req, res) => {
    try {
        return res.redirect("/register");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error /");
    }
});

// Register
app.get("/register", (req, res) => {
    try {
        const {success, error} = req.query;
        return res.render("Register", {success, error});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error /register");
    }
});

app.post("/create_person", async (req, res) => {
    try {
        const {username, password, email} = req.body;

        const data = {
            username: username,
            password: password,
            email: email 
        }; 

        const response = await axios.post(base_url + "/create_person", data);

        if (response.data?.success) return res.redirect(`/register?success=${encodeURIComponent(response.data?.success)}`);
        else if (response.data?.error) return res.redirect(`/register?error=${encodeURIComponent(response.data?.error)}`);
        else return res.redirect(`/register?error=${"An error occurred."}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error /create_person");
    }
});

// Login
app.get("/login", async (req, res) => {
    try {
        const {success, error, notsuccess} = req.query;

        if (success) {
            const response = await axios.post(base_url + "/check_employee", {id_person: req.cookies.idUser});

            if (response.data?.success) {
                const response = await axios.post(base_url + "/check_status_employee", {id_person: req.cookies.idUser});

                if (response.data?.success) return res.redirect("/"); // home
                else if (response.data?.notsuccess) return res.redirect(`/login?notsuccess=${encodeURIComponent(response.data?.notsuccess)}`);
                else return res.redirect(`/login?error=${"An error occurred."}`);
            } else if (response.data?.error) return res.redirect("/personalInfo");
            else return res.redirect(`/login?error=${"An error occurred."}`);
        } else return res.render("Login", {error, notsuccess});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error /login");
    }
});

app.post("/check_person", async (req, res) => {
    try {
        const {username, password} = req.body;

        const data = {
            username: username,
            password: password
        };

        const response = await axios.post(base_url + "/check_person", data);

        if (response.data?.success) {
            res.cookie('idUser', response.data?.ID, { maxAge: 900000, httpOnly: true });
            return res.redirect(`/login?success=${encodeURIComponent(response.data?.success)}`);
        } else if (response.data?.error) return res.redirect(`/login?error=${encodeURIComponent(response.data?.error)}`);
        else return res.redirect(`/login?error=${"An error occurred."}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error /check_person");
    }
});

// PersonalInfo
app.get("/personalInfo", (req, res) => {
    try {
        return res.render("PersonalInfo");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error /personalInfo");
    }
});

app.post("/create_employee", async (req, res) => {
    try {
        const {firstnameThai, lastnameThai, firstnameEng, lastnameEng, 
            birthday, address, email, number, position} = req.body;
        
        const data = {
            id_person: req.cookies.idUser,
            firstnameThai: firstnameThai, lastnameThai: lastnameThai,
            firstnameEng: firstnameEng, lastnameEng: lastnameEng,
            birthday: birthday, address: address, email: email,
            number: number, position: position, status: false
        }

        const response = await axios.post(base_url + "/create_employee", data);

        if (response.data?.success) return res.redirect(`/login?notsuccess=${encodeURIComponent(response.data?.notsuccess)}`);
        else if (response.data?.error) return res.redirect(`/personalInfo?error=${encodeURIComponent(response.data?.error)}`);
        else return res.redirect(`/personalInfo?error=${"An error occurred."}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error /create_employee");
    }
});

app.listen(5500, () => console.log(`Employee_Management_front-end: http://localhost:5500`));