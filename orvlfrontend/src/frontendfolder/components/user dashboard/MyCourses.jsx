import React,{useEffect,useState} from 'react'
import NavbarUD from './NavbarUD'
import logo123 from '../ug/Images/logo1.jpg';
import { useParams } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
      const isAuthenticated = localStorage.getItem('authToken'); // Check your auth logic
      if (!isAuthenticated) {
        navigate('/olvug', { replace: true });
      }
    }, [navigate]);
  return (
    <div>
  
    <NavbarUD userId={id}/>
    </div>
  )
}

export default MyCourses