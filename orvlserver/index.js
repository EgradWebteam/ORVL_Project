const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const crypto = require('crypto');
const session = require('express-session');
const cookieParser = require('cookie-parser');


const app = express();
const port = 8000;
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key', // Replace with a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true in production with HTTPS
}));
// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials:true,
    
}));


// Create a MySQL connection pool
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'orvl_project_database_main'
// });
// const promisePool = pool.promise(); // Use promisePool for async/await

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));
app.use(session({
    secret: 'your-secret-key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

const ExamCreation = require('./ExamCreation');
app.use('/ExamCreation', ExamCreation);
//Import the CourseCreation router
const CourseCreation = require('./CourseCreation');
app.use('/CourseCreation', CourseCreation);
const TopicCreation = require('./TopicCreation');
app.use('/TopicCreation', TopicCreation);

//Import the VideoCreation router
const VideoCreation = require('./VideoCreation');
app.use('/VideoCreation', VideoCreation);


const login=require('./login')
app.use('/login',login)
const resetpassword=require('./resetpassword')
app.use('/resetpassword',resetpassword)
const profile=require('./profile')
app.use('/profile',profile)
const register=require('./register')
app.use('/register',register)
const course=require('./course')
app.use('/course',course)

const otpStore = {};
 
//start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
 