import React,{useState,useEffect} from 'react'
import axios from 'axios';
import NavbarUD from './NavbarUD'

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Userdashboard.css';


const UserDashboard = () => {
    const { id } = useParams();
    const [profileDatadisplay, setProfileDatadisplay] = useState({});
    const navigate = useNavigate();
    
  useEffect(() => {
    const fetchProfiledisplay = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/profile/profile/${id}`);
        setProfileDatadisplay(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (id) {
      fetchProfiledisplay();
    } else {
      console.error('No user ID provided in URL');
    }
  }, [id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
        return "Good Morning";
    } else if (hour >= 12 && hour < 15) {
        return "Good Afternoon";
    } else if (hour >= 15 && hour < 19) {
        return "Good Evening";
    } else {
        return "Good Night";
    }
};


useEffect(() => {
  const isAuthenticated = localStorage.getItem('authToken'); // Check your auth logic
  if (!isAuthenticated) {
    navigate('/olvug', { replace: true });
  }
}, [navigate]);
  return (
    <div>
               

    <NavbarUD  userId={id} />
    <div className='userInterfaceMainCon'>
    { profileDatadisplay && (
        <div className='dashboardvl'>
       <h1> {getGreeting()}{profileDatadisplay.name}</h1> 
           <h2>  Happy Learning!</h2>
          
        </div>
      )} 
       
    </div>
    </div>
  )
}

export default UserDashboard