import React from 'react'
import { TfiYoutube } from "react-icons/tfi";
import { IoIosArrowForward } from "react-icons/io";
import '../styles/Olvug.css'

const OlvFooter = () => {
  return (
    <div>
        <div id="contact" className='Footerolv'>
            <div className="subfooter">
                <div className="foot1 aboutfoot">
                    <div className="headFooter">
                    <h2>ABOUT US</h2>
                    </div>
                    <div className="parafoot">
                   
                    eGRADTutor started with a team of graduates from IIT/IISc.We are experts in training students for UG, PG, MBA and CA entrance examinations.

                    </div>
                </div>
                <div className=" foot1 PoPfoot">
                    <div className="  headFooter">
                   <h2>POPULAR PACKAGES</h2>
                    </div>
                    <div className="parafoot">
                    <ul  className='ulfpli'><li><IoIosArrowForward /><a href="">IITJEE MATHEMATICS - MAINS & ADVANCED - 2025</a></li></ul>
                    </div>
                </div>
           
            <div className=" foot1 PoPfoot">
                    <div className="  headFooter">
                   <h2>QUICK LINKS</h2>
                    </div>
                    <div className="parafoot">
                        <ul  className='ulfpli'>
                        <li><IoIosArrowForward /><a href="/">Home</a></li>
                            <li><IoIosArrowForward /><a href="">ABOUT US</a></li>
                            <li><IoIosArrowForward /><a href="#features">Features</a></li>
                            <li><IoIosArrowForward /><a href="">Test Pakages</a></li>
                            <li><IoIosArrowForward /><a href="">Contact Us</a></li>
                        
                        </ul>
                    </div>
                
            </div>
           
            <div className=" foot1 PoPfoot">
                    <div className="  headFooter">
                   <h2>CONTACT</h2>
                    </div>
                    <div className="parafoot">
                     <ul><li>Contact
                     Address : R.K Nivas, 2nd Floor, Shivam Road, New Nallakunta, Hyderabad-500044</li>
                    
                    <li>Phone: <a href="tel:7993270532">7993270532</a></li>
                    <li>Email: <a href="mailto:info@egradtutor.in"> info@egradtutor.in</a> </li>
                    
                <li>Website: <a href="https://online-ug.egradtutor.in/">online-ug.egradtutor.in</a> </li>
                 <li>Follow: <a href="https://www.youtube.com/@eGRADTutor">      <TfiYoutube style={{ color: "#fff" }} /></a></li></ul></div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default OlvFooter