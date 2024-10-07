import React from 'react'
import Logo_img from '../images/logo.png'
import { IoMdHome } from "react-icons/io";
import { FaBagShopping } from "react-icons/fa6";
import i1 from '../images/em1.png'
import i2 from '../images/em2.png'
import i3 from '../images/em3.png'
import i4 from '../images/em4.png'
import f2 from '../images/f2.png'
import f3 from '../images/f3.png'
import f4 from '../images/f4.png'
import folv1 from '../images/folv1.png'
import folv2 from '../images/folv2.png'
import folv3 from '../images/folv3.png'

import buyolv from '../images/buyolv.png'
import f5 from '../images/f5.png'
import '../styles/NeetOLV.css'

const NeetOLV = () => {
  return (
    <div>
            <div className='neetots neetolv'>
        <div className='mainf'>
      <div className='headerf'>
         <div className='headerjee'>
            <img src = {Logo_img} />
         </div>
          <a className='jeeanchor' href='/Home'>
          <IoMdHome /> Home
          </a>
          </div>
        
          <div className='divboxts divots'>
          
        <h1 className='jeetsh1'>
        NEET - ONLINE LIVE VIDEO CLASSES
        </h1>
        </div>
        <ul className='ulneetolv'>
      <div className='dpjts '>
        <h2 className='neetotsh2'>NEET - ONLINE LIVE VIDEO CLASSES FOR YEAR 2024</h2>
        <li>Top faculty from IIT/IISc and IISER at eGRADTutor, through this course will cover the complete syllabus of XI and XII (P+C) in 5 to 6 months.</li>
        <li> This course comes with practice tests and challenger questions, which will be discussed in detail by the faculty in guidance sessions.</li>
        <li>    This course comes with practice tests and challenger questions, which will be discussed in detail by the faculty in guidance sessions.</li>
        <li>Through evaluation sessions, on 4th Saturday every month, student can know about key areas of improvement.</li>
        <li>These classes are designed perfectly to cater each and every student to learn, practice and perform.</li>
      

     </div>
     </ul>
      <div className='wotsbg' id='wots'>
      <div className='wots'>
        <div className='wotsm'>
          <h2 className='wotsh2'>WHY ONLINE LIVE VIDEO CLASSES?</h2>
          <ul className='ulwots'>
            <li className='liots'>
              <div className='wotsimg neetolv'>
                <img src={i4}/>
              </div>
              <p className='pwots'>Classroom just for you!! Anywhere, Anytime!</p>
            </li>
            <li className='liots'>
              <div className='wotsimg neetolv'>
                <img src={f3 } />
              </div>
              <p className='pwots'>Live online video classes encourage participation of students.</p>
            </li>
            <li className='liots'>
              <div className='wotsimg neetolv'>
                <img src={i1}/>
              </div>
              <p className='pwots'>Live online video classes allow interaction with students through chats and comments.</p>
            </li>
            <li className='liots'>
              <div className='wotsimg neetolv'>
                <img src={f5}/>
              </div>
              <p className='pwots'>Helps students to understand complex information through immediate answers to questions.</p>
            </li>
          </ul>
        </div>
      </div>
      </div>
      

      <div className='buyjee'>
          <h2 className='buyh2'>BUY ONLINE LIVE VIDEO CLASSES
          </h2>
          
            <div className ='buycard neetcard'>
            <div className='buyimg'>
              <img src={buyolv}/>
            </div>
            <div className='buymain'>
                <b>
                    <p>NEET 1st Year BATCH</p>
                    <small className='syll'>For complete NEET - 2025 Syllabus</small>
                </b>
                <div className='subjectneet'>
                    <div className='subjectsub'>
                        <b className='py'>PHYSICS</b>
                        <ul className='pyul'>
                            <li>MONDAY-WEDNESDAY-FRIDAY</li>
                            <li>7:00PM to 8:30PM</li>
                        </ul>
                    </div>
                    <div className='subjectsub'>
                        <b className='py'>CHEMISTRY</b>
                        <ul className='pyul'>
                            <li>TUESDAY-THURSDAY-SATURDAY</li>
                            <li>7:00PM to 8:30PM</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='datebuyolv'>
                <b>COURSE DATE</b>
                <ul className='datebuycolor'>
                    <li
                    >Registration starts from<br/>
6th May 2024 to 13th May 2024.</li>
<li>Courses Valid till NEET-2024</li>
                </ul>
            </div>
           
            <div className='buybtn1'>
              <p className='BUYPARA'>₹60,000 + GST*</p>
              <a className='abuy' href='#wots'>Buy Now</a>
            </div>
            <small className='smlbuy'>Students can also register for individual subjects with course fee 35,000/- per subject</small>
          
        
        
          </div>
        </div>
        <div className='fots'>

          <div className='fotssubc'>
          <h2>FEATURES OF ONLINE TEST SERIES
          </h2>
          
          <ul className='fcardflex'>
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={folv1}/>
                </div>
                <div className='textf'>
                  <p className='pref cd'>
                  Study and Practice daily 1 hour to crack NEET - 2024
                  </p>
                </div>

              
              </div>
            </li>
      
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={folv2}/>
                </div>
                <div className='textf'>
                  <p className='pref cd'>
                  Learn shortcuts and multiple approaches to problem solving.
                  </p>
                </div>

              </div>
            </li>
        
       
       
           
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={folv3}/>
                </div>
                <div className='textf'>
                  <p className='pref cd'>
                 
               Develop time management and planning skills while preparing.
                  </p>
                </div>

              
              </div>
            </li>
   
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={f4}/>
                </div>
                <div className='textf'>
                  <p className='pref cd'>
                  Entire course of XI and XII (P+C) will be taught in 5 to 6 months.
                  </p>
                </div>

              </div>
            </li>
        </ul>
        </div>
        </div>
            </div>

    </div>
    </div>
  )
}

export default NeetOLV