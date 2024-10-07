const express = require("express");
const router = express.Router();
const db = require("./database");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs'); 
const path = require('path');

function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid naming conflicts
    }
});

const upload = multer({ storage });

router.get('/profile/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows.length > 0) {
            const user = rows[0];
            // Convert BLOB to Base64 string
            if (user.profile_photo) {
                user.profile_photo = Buffer.from(user.profile_photo).toString('base64');
            }
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
router.put('/profile/:id', async (req, res) => {
    const userId = req.params.id;
    const {
        name,
        
        mobile_no
        
        
    } = req.body;
  
    try {
        await db.query(
            `UPDATE users SET 
                name = ?,  
                mobile_no = ?
                
          
            WHERE id = ?`,
            [
                name,
                mobile_no,
               
                userId 
            ]
        );
        res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.put('/profile/photo/:id', upload.fields([{ name: 'profile_photo', maxCount: 1 }]), async (req, res) => {
    const userId = req.params.id;
    const profile_photo = req.files['profile_photo'] ? req.files['profile_photo'][0].path : null;

    if (!profile_photo) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    const profile_photo_buffer = fs.readFileSync(profile_photo);
    try {
        await db.query(
            `UPDATE users SET profile_photo = ? WHERE id = ?`,
            [profile_photo_buffer, userId]
        );
        res.json({ message: 'Profile photo updated successfully!' });
    } catch (error) {
        console.error('Error updating profile photo:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



module.exports = router;
