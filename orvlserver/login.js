const express = require("express");
const router = express.Router();
const db = require("./database");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}
const JWT_SECRET = 'your_secret_key';
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        req.session.userId = user.id;
        console.log( req.session.userId)
       const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful!',token, userId: user.id, role: user.role  });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// User Logout
router.post('/logout', (req, res) => {
    if (req.session) {
        // Destroy the session
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Failed to log out.' });
            }
            res.clearCookie('connect.sid'); // Clear the cookie as well
            res.json({ message: 'Logout successful.' });
        });
    } else {
        res.status(200).json({ message: 'No session to log out from.' });
    }
});




module.exports = router;     