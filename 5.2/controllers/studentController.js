const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort('-createdAt');
        res.render('index', { students });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Render add student form
exports.renderAddForm = (req, res) => {
    res.render('add');
};

// Add new student
exports.addStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.redirect('/students');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Render edit student form
exports.renderEditForm = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.render('edit', { student });
    } catch (err) {
        res.status(400).send('Invalid ID format');
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/students');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/students');
    } catch (err) {
        res.status(400).send(err.message);
    }
};
