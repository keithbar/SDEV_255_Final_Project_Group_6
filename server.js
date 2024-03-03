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
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

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
server.use(express.json()); //for parsing json objects
server.use(cookieParser()); //for parsing cookies

//get info about logged in user first
server.get("*", checkUser);

//send home page
server.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

//display courses --Aubrie
server.get("/courses", (req, res) => {
    Course.find()
        .then((results) => {
            res.render('courses', { title: 'Courses Catalog', courses: results });
        })
        .catch((err) => {
            console.log(err)
        });
});
//displays course detail page --Aubrie
server.get("/courses/:id/coursedetail", (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then((result) => {
            res.render("coursedetail", { course: result, title: "Course Detail" });
        })
        .catch((err) => {
            console.log(err);
        });
});

//new course page
server.get("/courses/create", (req, res) => {
    res.render("create", { title: "Add New Course" });
});

//delete course
server.post("/courses/:id/delete", (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then((result) => {
            Course.deleteOne({ _id: id })
                .then((result) => {
                    res.redirect("/courses");
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

//edit course page
server.get("/courses/:id/edit", (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then((result) => {
            res.render("edit", { course: result, title: "Edit Course" });
        })
        .catch((err) => {
            console.log(err);
        });
});

//update course in db when edit is submitted
server.post("/courses/:id/update", (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then((result) => {
            result.department = req.body.department;
            result.number = req.body.number;
            result.title = req.body.title;
            result.teacher = req.body.teacher;
            result.credits = req.body.credits;
            result.spots = req.body.spots;
            result.save()
                .then((result) => {
                    res.redirect("/");
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

//upload new course info to db, then redirect
server.post("/courses", (req, res) => {
    const course = new Course(req.body);
    course.save()
        .then((result) => {
            res.redirect("/courses");
        })
        .catch((err) => {
            console.log(err);
        });
});

//login/signup routes
server.use(authRoutes);

//send 404 error
server.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
});