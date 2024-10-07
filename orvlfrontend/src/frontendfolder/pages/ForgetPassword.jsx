import React, { useState,useEffect } from 'react';
import axios from 'axios';
import '../components/ug/styles/Olvug.css'
const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Step for OTP verification
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
const [otpExpired, setOtpExpired] = useState(false);


useEffect(() => {
    let timer;
    if (otpSent && !otpExpired) {
        timer = setTimeout(() => {
            setOtpExpired(true);
        }, 1 * 60 * 1000); 
    }
    return () => clearTimeout(timer);
}, [otpSent, otpExpired]);
const handleSendOtp = async (e) => {
    if (e) e.preventDefault(); // Only prevent default if an event is provided
    setError('');
    setSuccessMessage('');

    try {
        const response = await axios.post('http://localhost:8000/resetpassword/forgot-password', { email });
        alert(response.data.message);
        setStep(2); // Move to OTP input step
        setOtpSent(true); // Flag to indicate OTP was sent
        setOtpExpired(false); // Reset expiration status when a new OTP is sent
    } catch (err) {
        setError(err.response?.data?.message || 'Error sending OTP');
    }
};

const handleResendOtp = async () => {
    await handleSendOtp();
};

    
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:8000/resetpassword/verify-otp', { email, otp });
            if (response.data.success) {
                alert(response.data.message);
                setStep(3); // Move to reset password step
            } else {
                setError('Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error verifying OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
    
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setError('New password does not match confirmed password.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8000/resetpassword/reset-password', {
                email,
                newPassword,
                confirmPassword 
            });
            setSuccessMessage(response.data.message); 
            setStep(4); 
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password');
        }
    };
    

    return (
        <div className='forgetpassword'> 
            {step === 1 && (
                <form onSubmit={handleSendOtp} className='forgetpasswordform'>
                    <h2 className='fph2'>Forgot Password</h2>
                    <div className="flexbtnfp1">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className='inputfpem'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className='rstbtn lgnemailexist'>Send OTP</button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className='forgetpasswordform'>
                    <h2 className='fph2'>Verify OTP</h2>
                    <div className='flexbtnfp2'>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className='inputfpem'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <div className="btnvotprotp">

                    <button type="submit" className='lgnemailexist'>Confirm OTP</button>
                   
                    {error && <p className="error">{error}</p>}
                    {otpSent && otpExpired && (
                <button type="button" className='lgnemailexist' onClick={handleResendOtp}>Resend OTP</button>
                
            )} </div></div>
                </form>
            )}
            {step === 3 && (
                <form onSubmit={handleResetPassword} className='forgetpasswordform'>
                    <h2 className='fph2'>Reset Password</h2>
                    <div className="pswresetflex">
                    <input
                        type="password"
                        placeholder="New Password"
                        className='inputfpem'
                        
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        className='inputfpem'
                      
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className='rstbtn lgnemailexist'>Reset Password</button></div>
                    {error && <p className="error">{error}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                </form>
            )}
                {step === 4 && (
                <div>
                    <h2>Password Reset Successful!</h2>
                    <p>You can now log in with your new password.</p>
                </div>
            )}
        </div>
    );
};

export default ForgetPassword;
