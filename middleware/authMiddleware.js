const jwt = require("jsonwebtoken");
const User = require("../models/User");

//require login to view page
const requireAuthTeacher = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, "sdev255 secret", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.render("401", { title: "Not Authorized" });
            }
            let user = await User.findById(decodedToken.id);
            if (user.isTeacher){
                console.log(decodedToken);
                next();
            }
            else{
                res.render("401", { title: "Not Authorized" });
            }
        });
    }
    else{
        res.render("401", { title: "Not Authorized" });
    }
}

const requireAuthStudent = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, "sdev255 secret", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.render("401", { title: "Not Authorized" });
            }
            let user = await User.findById(decodedToken.id);
            if (user.isStudent){
                console.log(decodedToken);
                next();
            }
            else{
                res.render("401", { title: "Not Authorized" });
            }
        });
    }
    else{
        res.render("401", { title: "Not Authorized" });
    }
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, "sdev255 secret", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuthTeacher, requireAuthStudent, checkUser };