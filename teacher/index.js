const express = require('express');
const crypto = require('crypto');
const dotenv = require('dotenv');
const connectDB = require('./DBconnect');
const verifyTeacher = require('./middleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.post('/api/teacher/addassignment', verifyTeacher, (req, res) => {
    const { title, description, dueDate } = req.body;
    res.json({
        message: 'Assignment added successfully',
        assignment: {
            title: title,
            description: description,
            dueDate: dueDate
        }
    });
});

app.get('/api/teacher/searchstudent', verifyTeacher, (req, res) => {
    const { name } = req.query;
    const students = [
        { id: 1, name: 'Alice Johnson', grade: 'A' },
        { id: 2, name: 'Bob Smith', grade: 'B' },
        { id: 3, name: 'Charlie Brown', grade: 'A' }
    ];
    const result = name
        ? students.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
        : students;
    res.json({
        message: 'Student search completed',
        students: result
    });
});

app.delete('/api/teacher/removeassignment', verifyTeacher, (req, res) => {
    const { assignmentId } = req.body;
    res.json({
        message: 'Assignment removed successfully',
        assignmentId: assignmentId
    });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Teacher microservice running on port ${PORT}`);
});
