const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    //letter portion of ID, like "SDEV"
    department: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    //number of credit hours
    credits: {
        type: Number,
        required: true
    },
    //how many students can take course
    spots: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Course = mongoose.model("course", courseSchema);
module.exports = Course;