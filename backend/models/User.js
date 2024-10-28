// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    sessionToken: { type: String },
});

module.exports = mongoose.model('User', userSchema);
