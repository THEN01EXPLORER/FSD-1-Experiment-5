const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: [true, 'Roll number is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    course: {
        type: String,
        required: [true, 'Course is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);
