const express = require("express");
const router = express.Router();
const db = require("./database");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const crypto = require('crypto');

function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

// Endpoint to send OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Email not registered.' });
        }

        await db.query('UPDATE users SET otp = ? WHERE email = ?',
            [otp, email]);


        // Setup email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'webdriveegate@gmail.com',
                pass: 'qftimcrkpkbjugav'
            }
        });

        const mailOptions = {
            from: 'webdriveegate@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP.' });
    }
});

// Endpoint to verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const [otpRecord] = await db.query('SELECT * FROM users WHERE email = ? AND otp = ?', [email, otp]);

        if (otpRecord.length === 0) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // // Optionally, you could delete the OTP from the database after verification
        // await promisePool.query('DELETE FROM users WHERE email = ?', [email]);

        res.json({ message: 'OTP verified successfully!', success: true });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP.' });
    }
});
// Endpoint to reset password
// Endpoint to reset password
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    console.log('New Password:', newPassword);
    console.log('Confirmed Password:', confirmPassword);

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New password does not match confirmed password.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Hashed Password:', hashedPassword);

    try {
        // Update password in the database
        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
        res.json({ message: 'Password has been reset successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
});





module.exports = router;
