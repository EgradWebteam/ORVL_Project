import React, { useState, useEffect } from 'react';
import './Userdashboard.css';
import {  useParams } from 'react-router-dom';
import logo123 from '../ug/Images/logo1.jpg';
import axios from 'axios';
import { FaUserGraduate } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const NavbarUD = ({ userId }) => {
  const [activeButton, setActiveButton] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { id } = useParams();
  
  
  const [profileDatadis, setProfileDatadis] = useState({});
  const [visibledropdown, setVisibledropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfiledis = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/profile/profile/${id}`);
        setProfileDatadis(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (id) {
      fetchProfiledis();
    } else {
      console.error('No user ID provided in URL');
    }
  }, [id]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === `/UserDashboard/${userId}`) {
      setActiveButton('Dashboard');
    } else if (path === `/MyCourses/${userId}`) {
      setActiveButton('MyCourses');
    } else if (path === `/BuyCourses/${userId}`) {
      setActiveButton('BuyCourses');
    } else if (path === `/MyAccount/${userId}`) {
      setActiveButton('MyAccount');
    }
  }, [userId]);



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
   
    setVisibledropdown(!visibledropdown);
    
  };
  const handleMouseEnter = () => {
    if (window.innerWidth >= 834) { 
      setVisibledropdown(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 834) {
      setVisibledropdown(false);
    }
  }

const handleLogout = async () => {
  try {
      await axios.post('http://localhost:8000/login/logout');
      alert('Logout successful.');
      localStorage.removeItem('authToken'); // Clear the token
      // setIsAuthenticated(false); // Update authentication state
      navigate('/olvug'); // Use replace to prevent going back
  } catch (error) {
      alert('Failed to log out.');
  }
};
      

    

  return (
    <div>
      <div className="maindivheader">
        <div className='headerjeemvh'>
          <div className='padzero'>
            <img className="headerlogo" src={logo123} alt="Logo" />
          </div>
          <div>
            <button className='dropprofilehead'   onClick={toggleDropdown}  onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              {profileDatadis.profile_photo ? (
                <img src={`data:image/jpeg;base64,${profileDatadis.profile_photo}`} alt="Profile" className='imgpp' />
              ) : (
                <img src={logo123} alt="Default" className='imgpp' />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        &#9776; 
      </div>
      <div className={`sidebar udsidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="close-buttonsbhb" onClick={closeMenu}>
          &times; 
        </div>
        <a href={`/UserDashboard/${userId}`}>
          <button className={`btnudnb nav-button ${activeButton === 'Dashboard' ? 'active' : ''}`}>
            Dashboard
          </button>
        </a>
        <a href={`/MyCourses/${userId}`}>
          <button className={`btnudnb nav-button ${activeButton === 'MyCourses' ? 'active' : ''}`}>
            My Courses
          </button>
        </a>
        <a href={`/BuyCourses/${userId}`}>
          <button className={`btnudnb nav-button ${activeButton === 'BuyCourses' ? 'active' : ''}`}>
            Buy Courses
          </button>
        </a>
        <a href={`/MyAccount/${userId}`}>
          <button className={`btnudnb nav-button ${activeButton === 'MyAccount' ? 'active' : ''}`}>
            My Account
          </button>
        </a>
      </div>
      {visibledropdown && profileDatadis && (
        <div className='visibledropdown'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
           {/* <p><FaUserGraduate /> {profileDatadis.name}</p>
          <p><IoMdMail /> {profileDatadis.email}</p>
          <p><FaPhoneAlt /> {profileDatadis.mobile_no}</p>  */}
          <a href={`/MyAccount/${id}`} className="macud">
               Profile
            </a>
            <a href={`/MyAccount/${id}`} className="macud">
               Reset Password
            </a>
            <button onClick={handleLogout} className ='logoutbtn'>Logout</button>
          <p>
            
          </p> 
        </div>
      )} 
    </div>
  );
};

export default NavbarUD;