// Required modules
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const util = require('util');
const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Promisify sendMail
const sendMail = util.promisify(transporter.sendMail.bind(transporter));

// Generate OTP and send it via email
// Generate OTP and send it via email
router.post('/generate-otp', async (req, res) => {
    const { username, email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Check if user already exists by username or email
    let user = await User.findOne({ $or: [{ username }, { email }] });
    
    if (!user) {
        user = new User({ username, otp, email });
    } else {
        user.otp = otp; // Update OTP for existing user
        user.email = email; // Update email if it's different (optional)
    }

    try {
        await user.save();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        };

        await sendMail(mailOptions);
        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error saving user or sending email:',  error);
        res.status(500).json({ error: 'Failed to send OTP', details: error.message || error });
    }
});


// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { username, otp } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.otp !== otp) {
        return res.status(401).json({ message: 'Invalid OTP' });
    }

    const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.sessionToken = sessionToken;
    await user.save();

    res.json({ message: 'OTP verified', token: sessionToken });
});

module.exports = router;
