const express = require("express");
const router = express.Router();
const db = require("./database");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs'); 
const path = require('path'); // Import path




// Set up multer for image uploads and file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid naming conflicts
    }
});

// File filter to allow only specific formats
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const imageFileTypes = /jpeg|jpg|png/;
        const pdfFileTypes = /pdf/;
        const mimetype = imageFileTypes.test(file.mimetype) || pdfFileTypes.test(file.mimetype);
        const extname = imageFileTypes.test(path.extname(file.originalname).toLowerCase()) || 
                        pdfFileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true); // Accept the file
        }
        cb(new Error('Error: File upload only supports the following formats - png, jpg, jpeg for images and pdf for documents!')); // Reject the file
    }
});

function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}



// Route for handling form submission
router.post('/register', upload.fields([
    { name: 'profile_photo', maxCount: 1 }, 
    { name: 'tenth_certificate', maxCount: 1 },
    { name: 'twelfth_certificate', maxCount: 1 },
    { name: 'btech_certificate', maxCount: 1 }
]), async (req, res) => {
    const {
        name,
        fathername,
        dob,
        gender,
        mobile_no,
        email,
        present_streetadd,
        present_addressline2,
        present_city,
        present_state,
        present_zipcode,
        present_country,
        permanent_streetadd,
        permanent_addressline2,
        permanent_city,
        permanent_state,
        permanent_zipcode,
        permanent_country,
        tenth_percentage,
        twelfth_percentage,
        btech_percentage,
        university_roll_no,
        branch,
        college_state,
        college_city,
        college_name,
        coaching,
        batch,
        rollno,
        centername
    } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            console.log('Email already registered. Please log in.'); 
            return res.status(400).json({ message: 'Email already registered. Please log in.' });
        }
    } catch (error) {
        console.error('Error checking existing email:', error);
        return res.status(500).json({ message: 'Error checking email.' });
    }
    
    // Generate a random password
    const randomPassword = generateRandomPassword(12);
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Prepare the email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'webdriveegate@gmail.com',
            pass: 'qftimcrkpkbjugav' // Use environment variable or config for production
        }
    });
    const role = 'user';
    const mailOptions = {
        from: 'webdriveegate@gmail.com',
        to: email,
        subject: 'Your Registration Details',
        text: ` Hello ${name}Thank you for registering! Your password is: ${randomPassword}`
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    
    // Extract file paths
    const profile_photo = req.files['profile_photo'] ? req.files['profile_photo'][0].path : null;
    const tenth_certificate = req.files['tenth_certificate'] ? req.files['tenth_certificate'][0].filename : null;
    const twelfth_certificate = req.files['twelfth_certificate'] ? req.files['twelfth_certificate'][0].filename : null;
    const btech_certificate = req.files['btech_certificate'] ? req.files['btech_certificate'][0].filename : null;

    // Validation
    const errors = [];
    if (!name) errors.push('Name is required.');
    if (!fathername) errors.push('Father\'s name is required.');
    if (!dob) errors.push('Date of birth is required.');
    if (!gender) errors.push('Gender is required.');
    if (!mobile_no) errors.push('Mobile number is required.');
    if (!email) errors.push('Email is required.');
    if (!present_streetadd) errors.push('Street Address is required.');
    if (!present_addressline2) errors.push('Address Line 2 is required.');
    if (!present_city) errors.push('City is required.');
    if (!present_state) errors.push('State is required.');
    if (!present_zipcode) errors.push('Zip code is required.');
    if (!present_country) errors.push('Country is required.');
    if (!permanent_streetadd) errors.push('Permanent Street Address is required.');
    if (!permanent_addressline2) errors.push('Permanent Address Line 2 is required.');
    if (!permanent_city) errors.push('Permanent City is required.');
    if (!permanent_state) errors.push('Permanent State is required.');
    if (!permanent_zipcode) errors.push('Permanent Zip code is required.');
    if (!permanent_country) errors.push('Permanent Country is required.');
    if (!tenth_percentage) errors.push('10th class Percentage is required.');
    if (!twelfth_percentage) errors.push('12th class Percentage is required.');
    if (!btech_percentage) errors.push('BTech Percentage is required.');
    if (!university_roll_no) errors.push('University Roll No is required.');
    if (!college_city) errors.push('College City is required.');
    if (!college_state) errors.push('College State is required.');
    if (!college_name) errors.push('College Name is required.');
    if (!branch) errors.push('Branch is required.');
    if (!profile_photo) errors.push('Profile photo is required.'); 
    if (!tenth_certificate) errors.push('10th Class certificate is required.'); 
    if (!twelfth_certificate) errors.push('12th Class certificate is required.'); 
    if (!btech_certificate) errors.push('B.Tech certificate is required.');
    if (!coaching) errors.push('Coaching details are required.');

    if (coaching === 'yes') {
        if (!batch) errors.push('Batch is required.');
        if (!rollno) errors.push('Roll No is required.');
        if (!centername) errors.push('Center Name is required.');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(' ') });
    }

    const coachingDetails = coaching === 'no' ? [null, null, null] : [batch, rollno, centername];
    const profile_photo_buffer = fs.readFileSync(profile_photo);
    try {
        
        // Insert data into the database, including the hashed password
        await db.query(
            `INSERT INTO users (
                name, fathername, mobile_no, gender, email, dob,
                present_streetadd, present_addressline2, present_city, present_state, present_zipcode, present_country,
                permanent_streetadd, permanent_addressline2, permanent_city, permanent_state, permanent_zipcode, permanent_country,
                tenth_percentage, twelfth_percentage, btech_percentage, university_roll_no, college_city,
                college_state, college_name, branch,profile_photo,
                tenth_certificate, twelfth_certificate, btech_certificate, coaching, batch, rollno, centername,
                password,role
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            [
                name, fathername, mobile_no, gender, email, dob,
                present_streetadd, present_addressline2, present_city, present_state, present_zipcode, present_country,
                permanent_streetadd, permanent_addressline2, permanent_city, permanent_state, permanent_zipcode, permanent_country,
                tenth_percentage, twelfth_percentage, btech_percentage, university_roll_no, college_city,
                college_state, college_name, branch,profile_photo_buffer,
                tenth_certificate, twelfth_certificate, btech_certificate, coaching,
                coaching === 'yes' ? batch : null,
                coaching === 'yes' ? rollno : null,
                coaching === 'yes' ? centername : null,
                hashedPassword, // Save the hashed password in the database
                role
            ]
        );
        res.json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Error inserting into database:', error);
        res.status(500).json({ message: 'Error registering user!' });
    }
});



module.exports = router;
