// frontend/src/components/OTPInput.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OTPInput = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResubmit, setCanResubmit] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (timer > 0 && !canResubmit) {
            const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(countdown);
        }
        if (timer === 0) {
            setCanResubmit(true);
        }
    }, [timer, canResubmit]);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 3) document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    const handleGenerateOtp = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/generate-otp', {
                username,
                email,
            });
            alert('OTP sent to your email!');
            setTimer(60); // Reset the timer
            setCanResubmit(false);
        } catch (error) {
            setError('Failed to send OTP');
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');
        try {
            const response = await axios.post('http://localhost:5000/api/users/verify-otp', {
                username,
                otp: otpString,
            });
            alert(response.data.message);
        } catch (error) {
            setError('Invalid OTP');
            document.getElementById('otp-input-container').classList.add('error');
            setTimeout(() => document.getElementById('otp-input-container').classList.remove('error'), 500);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-2"
            />
            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 mb-4"
            />
            <button onClick={handleGenerateOtp} className="bg-blue-500 text-white p-2 mb-4">
                Generate OTP
            </button>
            <div id="otp-input-container" className="flex space-x-2 mb-4">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength="1"
                        className="border p-2 text-center w-12"
                    />
                ))}
            </div>
            <button onClick={handleSubmit} className="bg-green-500 text-white p-2">
                Verify OTP
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <p className={`text-gray-500 ${canResubmit ? '' : 'hidden'}`}>
                You can request a new OTP in {timer} seconds.
            </p>
        </div>
    );
};

export default OTPInput;
