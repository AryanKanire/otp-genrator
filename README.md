# OTP Verification App

## Overview

The **OTP Verification App** is a web application that allows users to register and verify their email addresses using One-Time Passwords (OTPs). The app utilizes Node.js, Express, and MongoDB for the backend, and it integrates with an email service to send OTPs securely.

## Features

- User registration
- Email verification via OTP
- Secure password handling
- Error handling for user registration and email sending
- Simple user interface

## Technologies Used

- **Backend**: Node.js, Express, MongoDB
- **Email Service**: Nodemailer (configured to send OTPs)
- **Database**: MongoDB

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/otp-verification-app.git

cd otp-verification-app
npm install



PORT=5000
MONGODB_URI=your_mongodb_uri
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password



node server.js

