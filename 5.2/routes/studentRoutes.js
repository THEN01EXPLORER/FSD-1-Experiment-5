const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.get('/add', studentController.renderAddForm);
router.post('/add', studentController.addStudent);
router.get('/edit/:id', studentController.renderEditForm);
router.post('/edit/:id', studentController.updateStudent);
router.post('/delete/:id', studentController.deleteStudent);

module.exports = router;
