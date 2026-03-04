require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_db')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Routes
app.use('/students', studentRoutes);

// Redirect root to /students
app.get('/', (req, res) => res.redirect('/students'));

app.listen(PORT, () => {
    console.log(`Student Management System running at http://localhost:${PORT}`);
});
