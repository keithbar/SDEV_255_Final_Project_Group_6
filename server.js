/*
Right now the server just returns the index file as the homepage,
and returns an error page for any other request. Adding additional
pages later will be easy.
Run this with node on your system and navigate to 127.0.0.1:3000
to see it in action.
--Keith
*/

//require external modules
const express = require("express"); //for serving webpages
const morgan = require("morgan"); //for console logging
const mongoose = require("mongoose"); //for database access
const Course = require("./models/course"); //for course schema

//create new express server
const server = express();

//connect to mongodb
const dbURI = "mongodb+srv://kbarber34:GqfsU5ySDoU3onwL@sdev255.gxv9ds4.mongodb.net/final_project_group_6?retryWrites=true&w=majority&appName=SDEV255"
mongoose.connect(dbURI)
    .then((result) => {
        //start server after connecting to db
        server.listen(3000);
    })
    .catch((err) => console.log(err));

server.set("view engine", "ejs"); //register view engine for ejs support
server.use(express.static("public")); //make public folder accessible directly
server.use(express.urlencoded({ extended: true })); //accept form data in url
server.use(morgan("dev")); //add logging to console

//send index.html as home page
server.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

//send 404 error
server.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
});