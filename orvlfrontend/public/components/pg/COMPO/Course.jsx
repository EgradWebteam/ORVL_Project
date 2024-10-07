import React from 'react'
import Course_Img from '../IMAGES/test.png'
import Fourse_Img from '../IMAGES/livevid.png'
import '../STYLES/Course.css'

const Course = () => {
  return (
   
    <div id='courses' className='pgcourse'>
        <h2 className='pgh2'>Our Courses</h2>
        
        <div className='pgcourses_sub_container'>
            <div className='pgcbox1'>
                <div className='img_text1'>
                    <div>
                        <h3 className='pgh3'>ONLINE TEST SERIES</h3>
                    </div>
                    <div className='cImage1'>
                        <img src={Course_Img} className='img1'  />
                        
                    </div>
                </div>
                    <div>
                    <ul className='pcl'>
                        <h4 className='h4h'>Features</h4>
                        <li className='cli'>Combination of subject/topic wise and full syllabus.</li>
                        <li className='cli'>Interface similar to that of the competitive exams</li>
                        
                        <li className='cli'>Detailed solutions with explanation</li>
                        <li className='cli'>Performance analysis reports</li>


                    </ul>
                    </div>
                    <div className='pgcourse_btn_list'>
                    <a href="" className='panc'>GATE</a>
                    <a href="" className='panc'>IITJAM</a>
                    <a href="" className='panc'>ESE</a>
                    <a href="" className='panc'>ISRO</a>
                    <a href="" className='panc'>BARK</a>
                    <a href="" className='panc'>JEST</a>
                    </div>
                
            </div>
            <div className='pgcbox2'>
                <div className='img_text2' id='IMGTXT'>
                    <div>
                        <h3 className='pgh3'>ONLINE LIVE VIDEO CLASSES</h3>
                    </div>
                    <div className='cImage2'>
                        <img src={Fourse_Img} className='img2' />
                        
                    </div>
                </div>
                <ul className='pcl'>
                        <h4 className='h4h'>Features</h4>
                        <li className='cli'>Accessible from anywhere and anytime</li>
                        <li className='cli'>Content curated by industry experts</li>
                        <li className='cli'>Frequent doubt clearing sessions</li>
                        <li className='cli'>Best-in-class user interface</li>
                       
                       


                </ul>
                <div className='pgcourse_btn_list'>
                    
                  
                    <a href="" className='panc'>GATE</a>
                    <a href="" className='panc'>IITJAM</a>
                    
                </div>
                
            </div>
        </div>
       

    </div>
  )
}

export default Course