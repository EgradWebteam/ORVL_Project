import React from 'react'
import Course_Img from '../Images/course.png'
import Fourse_Img from '../Images/image.png'
import '../styles/Courses.css'
import styled from 'styled-components';

const Courses = () => {
  return (
    <div id='courses' className='courses'>
        <h2 className='ugh2'>Our Courses</h2>
        
        <div className='courses_sub_container'>
            <div className='cbox1'>
                <div className='img_text1'>
                    <div>
                        <h3>ONLINE TEST SERIES</h3>
                    </div>
                    <div className='cImage1'>
                        <img src={Course_Img} className='img1'  />
                        
                    </div>
                </div>
                    <div>
                    <ul className='ucl'>
                        <h4 className='h4h'>Features</h4>
                        <li className='cli'>Interface similar to that of the competitive exams</li>
                        <li className='cli'>Combination of subject/topic wise and full syllabus.</li>
                        <li className='cli'>Detailed solutions with explanation</li>
                        <li className='cli'>Performance analysis reports</li>


                    </ul>
                    </div>
                    <div className='course_btn_list'>
                    <a href="" className='anc'>NEET</a>
                    <a href="" className='anc'>JEE <small className='sml'>(MAINS & ADVANCED)</small></a>
                    <a href="" className='anc'>BITSAT</a>
                    <a href="" className='anc'>VITEEE</a>
                    </div>
                
            </div>
            <div className='cbox2'>
                <div className='img_text2' id='IMGTXT'>
                    <div>
                        <h3>ONLINE LIVE VIDEO CLASSES</h3>
                    </div>
                    <div className='cImage2'>
                        <img src={Fourse_Img} className='img2' />
                        
                    </div>
                </div>
                <ul className='ucl'>
                        <h4 className='h4h'>Features</h4>
                        <li className='cli'>Content curated by industry experts</li>
                        <li className='cli'>Best-in-class user interface</li>
                        <li className='cli'>Frequent doubt clearing sessions</li>
                        <li className='cli'>Accessible from anywhere and anytime</li>


                </ul>
                <div className='course_btn_list'>
                    
                    <a href="" className='anc'>JEE <small className='sml'>(MAINS & ADVANCED)</small> </a>
                    <a href="" className='anc'>NEET</a>
                    <a href="" className='anc'>BITSAT+VITEEE</a>
                    
                </div>
                
            </div>
        </div>
       

    </div>
  )
}

export default Courses