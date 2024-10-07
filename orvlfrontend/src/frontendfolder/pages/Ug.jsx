import React, { useState }  from 'react'
import UgHeader from '../components/ug/compon/UgHeader'
import ExploreExam from '../components/ug/compon/ExploreExam'
import Courses from '../components/ug/compon/Courses'
import Footer from '../components/landingpage/footer/Footer'
import '../components/ug/styles/UgHeader.css'
import styled from 'styled-components';
import Logo_img from '../components/ug/Images/logo.png';
import { FaAngleDown } from "react-icons/fa";


const Ug = () => {
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
    <div className='ugmain'>
          <div className='fixcon'>
            <div className='subcontainer'>
                <div className='con1'>
                    <a href="/"><img src={Logo_img} /></a>
                </div>
                <div className='con2'>
                    <a href="/olvug" className='button'>Login/Registration</a>
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
                    <li><a href="/Downloadmain" className='navlist'>Downloads</a></li>
                    <li><a href="" className='navlist'>Mock Tests</a></li>

                </ul>

            </div>
            </div>
        <UgHeader/>
        <ExploreExam />
        <Courses />
        <Footer />
    </div>
  )
}

export default Ug