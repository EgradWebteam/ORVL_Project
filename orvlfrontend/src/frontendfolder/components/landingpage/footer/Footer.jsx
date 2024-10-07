import React from 'react'
import { FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

import "./footer.css"
const Footer = () => {
  return (
    <div className='container' id="footer">
        <div className='subcontainer' id='foot'>
            <div className='footerleft'>
                <div className='footleft'>
                    <div className="fh foot1head" >
                        <h4 className="footerh">eGradtutor</h4>

                    </div>
                    <div className="footerpara">

                        <p>eGRADTutor started with a team of graduates from IIT/IISc.We are experts in
                        training students for UG,<br /> PG, MBA and CA entrance examinations.</p>
                    </div>
                    <div className="footerlinks">
                        <a href="Privacy Policy">Privacy Policy</a>
                        <a href="">Terms and Conditions</a>
                        <a href="">Pricing & Refund Policy</a>
                        <a href="">Frequently Asked Questions</a>



                    </div>

                </div>
            </div>
            <div className='footerright'>
                <div className="footright">
                    <div className="fh foot2head">
                        <h4>Contact Us</h4>
                    </div>
                    <div className="footaddress">H.NO-2-2-1132/10/C, R.K Nivas, 2nd Floor, Opposite Bakers Q, Shivam Road,<br />
                        New Nallakunta, Hyderabad-44.
                    </div>



                    <div className="d-flex">
                        <div className="mobile">
                            <FaPhoneAlt  className='picon'style={{color:"white"}}/>
                           
                            <a href="telto:+91-7993270532">  91-7993270532</a>

                        </div>
                        <div className="mail">
                            <FaEnvelope  className='picon'style={{color:"white"}} />
                            <a href="mailto:info@egradtutor.in">   info@egradtutor.in</a>
                        </div>
                        <div class="iconslinks">
                            <FaFacebook className='icon' />
                            <FaInstagram className='icon' />
                            <FaLinkedin className='icon' />
                            <FaYoutube className='icon' />
                        </div>
                    </div>
                </div>
               
            </div>

           
        </div>
     
       <p class="pc">Copyright &copy 2024 eGRADTutor All rights reserved</p>
    </div>
            
       
  )
}
export default Footer
