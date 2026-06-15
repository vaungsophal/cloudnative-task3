const express = require('express');
global.crypto = require('crypto');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const connectDB = require('./DBconnect');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

function verifyStudent(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'student') {
            return res.status(403).json({ message: 'Access denied. Student role required.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}

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
