// import React from 'react'
import { Link } from 'react-router-dom'
import Logo_img from '../Images/logo.png';
import { FaAngleDown } from "react-icons/fa";
import '../styles/UgHeader.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../Images/new landingbanner.d7950e84542985b05647 (1).png'
import banner2 from '../Images/BITSAT CRASH COURSE BANNER.31778deec7f60b0f0d30.jpg'
import banner3 from '../Images/JEE ADVANCED MATHEMATICS WEB BANNER 1.97dcff1bd19ee3dd03f6.jpg'
import banner4 from '../Images/NEET Banner - 2.c2bae78eeb8f65413d04.jpg'
import { click } from '@testing-library/user-event/dist/click';
import React, { useState } from 'react';

const UgHeader = () => {
    const [isBox1Visible, setIsBox1Visible] = useState(false);
    const [isBox2Visible, setIsBox2Visible] = useState(false);

    const click1 = () => {
        
        if (isBox1Visible==false){
            setIsBox1Visible(true)
        }
        else{
            setIsBox1Visible(false)
        }
      
    }
    const click2 = () => {
       
        if (isBox2Visible==false){
            setIsBox2Visible(true)
        }
        else{
            setIsBox2Visible(false)
        }
      
    }
   
    return (
       
        <div className="container">
            {/* <div className='fixcon'>
            <div className='subcontainer'>
                <div className='con1'>
                    <a href="/"><img src={Logo_img} /></a>
                </div>
                <div className='con2'>
                    <a href="" className='button'>Login/Registration</a>
                </div>
            </div>
            <div className='navbar'>
                <ul className='navmenu'>
                    <li><a href="/" className='navlist'>Home</a></li>
                    <li><a href="#exam" className='examdrop' onClick={click1}>Exams <FaAngleDown  className='fadown' style={{color:"white"}}/></a>
                    { isBox1Visible &&
                    (<div className='exam_dropdown Box2'>
                        <a href='' className='ancdrop' >JEE</a>
                        <a href='' className='ancdrop' >NEET</a>
                        <a href='' className='ancdrop' >BITSAT</a>
                        <a href='' className='ancdrop' >VITEEE</a></div>)}</li>
                    <li><a href="#courses" className='examdrop' onClick={click2}>Courses <FaAngleDown className='fadown' style={{color:"white"}}/></a>
                    { isBox2Visible &&
                    (<div className='exam_dropdown Box2'>
                        <a href='' className='ancdrop' >ONLINE TEST SERIES</a>
                        <a href='' className='ancdrop' >ONLINE LIVE VIDEO CLASSES</a></div>)}</li>
                    <li><a href="" className='navlist'>About Us</a></li>
                    <li><a href="" className='navlist'>Contact Us</a></li>
                    <li><a href="" className='navlist'>Downloads</a></li>
                    <li><a href="" className='navlist'>Mock Tests</a></li>

                </ul>

            </div>
            </div> */}

            <div className='marq'>
                <div className='marqc'>
                    <marquee width="100%" direction="left" height="20px">

                        All tests will be LIVE according to the detailed schedule given. Do not confuse to the Total No. of tests in the test cards while buying as they show the number of tests LIVE at the moment..

                    </marquee>
                </div>
            </div>
            <div>
            <Carousel
            className='Slider'
            autoPlaySpeed={2}
            autoPlay={true}
            infiniteLoop={true}
            >
               
            <li>
                <div className='slide'>
                    <img src={banner1}></img>
                </div>
            </li>
            <li>
          
            <div className='slide'>
                <img src={banner2}></img>
                </div>
            </li>
            <li>
                <div className='slide'>
                <img src={banner3}></img>
                </div>
            </li>
            <li>
                <div className='slide'>
                <img src={banner4}></img>
                </div>
            </li>
           
            </Carousel>
            </div>
            

           
        </div>
    )
    // Change slide every 3 seconds
}

export default UgHeader