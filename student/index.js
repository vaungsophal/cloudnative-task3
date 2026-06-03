const express = require('express');
global.crypto = require('crypto');
const dotenv = require('dotenv');
const connectDB = require('./DBconnect');
const verifyStudent = require('./middleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/api/student/viewassignment', verifyStudent, (req, res) => {
    const assignments = [
        { id: 1, title: 'Math Homework', dueDate: '2026-06-01' },
        { id: 2, title: 'Science Project', dueDate: '2026-06-15' },
        { id: 3, title: 'English Essay', dueDate: '2026-06-10' }
    ];
    res.json({
        message: 'Assignments retrieved successfully',
        assignments: assignments
    });
});

app.put('/api/student/updateprofile', verifyStudent, (req, res) => {
    const { name, email } = req.body;
    res.json({
        message: 'Student profile updated successfully',
        studentId: req.user.id,
        name: name,
        email: email
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Student microservice running on port ${PORT}`);
});
