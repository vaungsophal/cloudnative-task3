const express = require('express');
const httpProxy = require('http-proxy');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

app.get('/', (req, res) => {
    res.send('API Gateway is running!');
});

const routes = [
    { prefix: '/api/register', target: process.env.REGISTRATION_SERVICE },
    { prefix: '/api/users', target: process.env.REGISTRATION_SERVICE },
    { prefix: '/api/login', target: process.env.AUTHENTICATION_SERVICE },
    { prefix: '/api/student', target: process.env.STUDENT_SERVICE },
    { prefix: '/api/teacher', target: process.env.TEACHER_SERVICE },
];

app.use((req, res) => {
    for (const route of routes) {
        if (req.path.startsWith(route.prefix)) {
            return proxy.web(req, res, { target: route.target });
        }
    }
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
