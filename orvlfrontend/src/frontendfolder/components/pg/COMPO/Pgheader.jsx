import React from 'react'
import Logo_img from '../IMAGES/image.png'
import Bannet_img from '../IMAGES/Pg Home banner.09b177bd9d824326c3d6.png'
import '../STYLES/Pghead.css'
const Pgheader = () => {
  return (
    <div>
        <div className="container">
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
                    <li><a href="#HOME" className='navlist'>Home</a></li>
                    <li><a href="#Exams" className='examdrop'>Exams</a></li>
                    <li><a href="#courses" className='examdrop'>Courses</a></li>
                    <li><a href="" className='navlist'>About Us</a></li>
                    <li><a href="" className='navlist'>Contact Us</a></li>
                    <li><a href="" className='navlist'>Downloads</a></li>
                    <li><a href="" className='navlist'>Mock Tests</a></li>

                </ul>

            </div>
            </div>
            <div className='pgmarq'>
                <div className='pgmarqc'>
                    <marquee width="100%" direction="left" height="30px">
                        <span className='UPD'>UPDATE</span>

                        All tests will be LIVE according to the detailed schedule given. Do not confuse to the Total No. of tests in the test cards while buying as they show the number of tests LIVE at the moment..

                    </marquee>
                </div>
            </div>
            <div className='BANNERIMAGE' id='HOME'>
                <img src={Bannet_img} />
            </div>
            
            
    </div>    
   
  )
}

export default Pgheader