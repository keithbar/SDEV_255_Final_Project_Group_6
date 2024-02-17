/*
Right now the server just returns the index file as the homepage,
and returns an error page for any other request. Adding additional
pages later will be easy.
Run this with node on your system and navigate to 127.0.0.1:3000
to see it in action.
--Keith
*/

//require express module
const express = require("express");

//create new express server
const server = express();

//listen for requests
server.listen(3000);

//send index.html as home page
server.get("/", (req, res) => {
    res.sendFile("./views/index.html", {root: __dirname});
});

//send 404 error
server.use((req, res) => {
    res.status(404).sendFile("./views/404.html", {root: __dirname});
});