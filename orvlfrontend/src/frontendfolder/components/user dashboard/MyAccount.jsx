import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavbarUD from './NavbarUD';
import logo123 from '../ug/Images/logo1.jpg';
import './Userdashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
    const [profileData, setProfileData] = useState({});
    const [editprofileupdate, setEditProfileupdate] = useState(true);
    const [resetpassword, setResetpassword] = useState(false);
    const { id } = useParams();
    const [formDataupdate, setFormDataupdate] = useState({
        name: '',
        mobile_no: '',
        email: '',
    });
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Step for OTP verification
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
      const isAuthenticated = localStorage.getItem('authToken'); // Check your auth logic
      if (!isAuthenticated) {
        navigate('/olvug', { replace: true });
      }
    }, [navigate]);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/profile/profile/${id}`);
                setProfileData(response.data);
                setFormDataupdate({
                    name: response.data.name || '',
                    mobile_no: response.data.mobile_no || '',
                    email: response.data.email || '',
                });
                setEmail(response.data.email); // Set email from profile data
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        if (id) {
            fetchProfile();
        } else {
            console.error('No user ID provided in URL');
        }
    }, [id]);

    useEffect(() => {
        let timer;
        if (otpSent && !otpExpired) {
            timer = setTimeout(() => {
                setOtpExpired(true);
            }, 1 * 60 * 1000); // 1 minute for OTP expiration
        }
        return () => clearTimeout(timer);
    }, [otpSent, otpExpired]);
    
    const handleSendOtp = async () => {
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:8000/resetpassword/forgot-password', { email });
            alert(response.data.message);
            
            setOtpSent(true); // Flag to indicate OTP was sent
            setOtpExpired(false); // Reset expiration status when a new OTP is sent
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending OTP');
        }
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

    const editprofile = () => {
        setEditProfileupdate(true);
        setResetpassword(false);
    }

    const resetpsw = () => {
        setEditProfileupdate(false);
        setResetpassword(true);
        handleSendOtp(); // Automatically send OTP when Reset Password is clicked
        setStep(2);
    }
    const handleResendOtp = async () => {
        await handleSendOtp();
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataupdate({ ...formDataupdate, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/profile/profile/${id}`, formDataupdate);
            alert('Profile updated successfully!');
            const response = await axios.get(`http://localhost:8000/profile/profile/${id}`);
            setProfileData(response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile.');
        }
    };
    const handleUpdatePhoto = async (file) => {
        const formData = new FormData();
        if (file) {
            formData.append('profile_photo', file);
        }

        try {
            const response = await axios.put(`http://localhost:8000/profile/profile/photo/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            const updatedResponse = await axios.get(`http://localhost:8000/profile/profile/${id}`);
            setProfileData(updatedResponse.data); // Update profile data with new photo
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile photo:', error);
            alert('Failed to update profile photo. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
        handleUpdatePhoto(file); 
    };
    return (
        <div>
            <NavbarUD userId={id} />
            
            <div className='userInterfaceMainCon'>
                {profileData.name ? (
                    <div>
                       <div className='imgdivppac'>
                       <h1> {profileData.name}</h1>
                       
                        <div className='imgppac'>
                        <img src={`data:image/jpeg;base64,${profileData.profile_photo}`} alt="sg" className='imgpp' />  
                        <form onSubmit={handleUpdatePhoto}>
                        <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="fileInput"
                                />
                                <label htmlFor="fileInput" className="pen-icon">
                                    <FontAwesomeIcon icon={faPen} />
                                </label>
                        </form>
                       </div>
                       </div>
                        <div className='updatedataform'>
                            <div className="btnrstedit">
                            <button onClick={editprofile} className='btnfph2'>Edit Profile</button>
                            <button onClick={resetpsw} className='btnfph2'>Reset Password</button>
                            </div>
                            
                            {editprofileupdate && (
                                <form onSubmit={handleUpdate} className='resetform'>
                                    <div className="updateformgrid">
                                        <div className='disflforlabel'>
                                            <label htmlFor="name" className='nephoneno'>Name:</label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={formDataupdate.name}
                                                placeholder="Name"
                                                className=' inputfpem inputfupdform'
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className='disflforlabel'>
                                        <label htmlFor="email" className='nephoneno '>Email:</label>
                                            <input
                                                type="email"
                                                title="You can't change this field"
                                                name="email"
                                                id="email"

                                                placeholder='Email'
                                               className='inputfpem inputfupdform emailac'
                                                value={formDataupdate.email}
                                                onChange={handleChange}
                                                required
                                                readOnly
                                            />
                                        </div>
                                        <div className='disflforlabel'>
                                        <label htmlFor="mobile_nob" className='nephoneno'>Mobile No:</label>
                                            <input
                                                type="text"
                                                name="mobile_no"
                                                id="mobile_nob"
                                                className='inputfpem inputfupdform mbnofor'
                                                placeholder='Mobile No'
                                                value={formDataupdate.mobile_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="updateformgrid">
                                    <button className='lgnemailexist' type="submit">Update Profile</button>
                                    </div>
                                </form>
                            )}
                            <div id='resetpassword'>
                            {resetpassword && (
                                <div className='resetpassword'> 
                                    {step === 2 && (
                                        <form onSubmit={handleVerifyOtp} className='resetform'>
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
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                    {step === 3 && (
                                        <form onSubmit={handleResetPassword} className='resetform'>
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
                                                <button type="submit" className='rstbtn lgnemailexist'>Reset Password</button>
                                            </div>
                                            {error && <p className="error">{error}</p>}
                                            {successMessage && <p className="success">{successMessage}</p>}
                                        </form>
                                    )}
                                    {step === 4 && (
                                        <div className='resetform'>
                                            <h2>Password Reset Successful!</h2>
                                           
                                        </div>
                                    )}
                                </div>
                            )}
                       </div> </div>
                    </div>
                ) : (
                    <p>Loading profile data...</p>
                )}
                
                
            </div>
        </div>
    );
};

export default MyAccount;
