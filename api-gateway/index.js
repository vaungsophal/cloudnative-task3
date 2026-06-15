const express = require('express');
const app = express()

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer();

const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET;

function authToken(req, res, next) {
    console.log(req.headers.authorization)
    const header = req?.headers.authorization;
    const token = header && header.split(' ')[1];

    if (token == null) return res.status(401).json("Please send token");

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json("Invalid token", err);
        req.user = user;
        next()
    })
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json("Unauthorized");
        }
        next();
    }
}

//REDIRECT TO THE REGISTRATION MICROSERVICE
app.use('/api/register', (req, res) => {
    console.log("INSIDE API GATEWAY REGISTER ROUTE")
    proxy.web(req, res, { target: process.env.REGISTRATION_SERVICE });
})

//REDIRECT TO THE LOGIN(Authentication) MICROSERVICE
app.use('/api/login', (req, res) => {
    console.log("INSIDE API GATEWAY LOGIN ROUTE")
    proxy.web(req, res, { target: process.env.AUTHENTICATION_SERVICE });
})

//REDIRECT TO THE STUDENT MICROSERVICE
app.use('/api/student', authToken, authRole('student'), (req, res) => {
    console.log("INSIDE API GATEWAY STUDENT ROUTE")
    proxy.web(req, res, { target: process.env.STUDENT_SERVICE });
})

//REDIRECT TO THE TEACHER MICROSERVICE
app.use('/api/teacher', authToken, authRole('teacher'), (req, res) => {
    console.log("INSIDE API GATEWAY TEACHER ROUTE")
    proxy.web(req, res, { target: process.env.TEACHER_SERVICE });
})

app.listen(process.env.PORT || 4000, () => {
    console.log("API Gateway Service is running on PORT NO : " + (process.env.PORT || 4000))
})
