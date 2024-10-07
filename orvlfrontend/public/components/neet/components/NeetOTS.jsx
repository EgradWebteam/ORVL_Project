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
import buy1 from '../images/buy1.png'

import '../styles/NeetOTS.css'

const NeetOTS = () => {
  return (
    <div className='neetots'>
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
        NEET - ONLINE TEST SERIES
        </h1>
        </div>
      <div className='dpjts '>
        <h2 className='neetotsh2'>NEET - ONLINE TEST SERIES - 2024</h2>
        <p className='parajeets'>
        The National eligibility and entrance test is conducted every year by the national testing agency for admission to MBBS colleges in India. Preparing well and attempting the exam successfully is one of the greatest desires of MBBS aspirants. NEET Online Test Series provides the students with an opportunity to assess their learning and understanding of the subject before showcasing their prowess in the final examination. Our online test series makes your understanding stronger and helps you prepare better. We at eGRADTutor academy are offering 15 online tests and 5 previous year question papers as part of the NEET UG Challenger test series.
        </p>

     </div>
      <div className='wotsbg' id='wots'>
      <div className='wots'>
        <div className='wotsm'>
          <h2 className='wotsh2'>WHY ONLINE TEST SERIES?</h2>
          <ul className='ulwots'>
            <li className='liots'>
              <div className='wotsimg neetem'>
                <img src={i1}/>
              </div>
              <p className='pwots'>Helps in enhancing the student's speed and accuracy of answering questions in the examination.</p>
            </li>
            <li className='liots'>
              <div className='wotsimg neetem'>
                <img src={i2 } />
              </div>
              <p className='pwots'>Our online test series is crafted by academic experts with years of domain knowledge and experience.</p>
            </li>
            <li className='liots'>
              <div className='wotsimg neetem'>
                <img src={i3}/>
              </div>
              <p className='pwots'>Practice with our NEET online test series to be aware of the hurdles that you might face while attempting the final examination.</p>
            </li>
            <li className='liots'>
              <div className='wotsimg neetem'>
                <img src={i4}/>
              </div>
              <p className='pwots'>Practice with our NEET online test series to be aware of the hurdles that you might face while attempting the final examination.</p>
            </li>
          </ul>
        </div>
      </div>
      </div>
      

      <div className='buyjee'>
          <h2 className='buyh2'>BUY ONLINE TEST SERIES</h2>
          
            <div className ='buycard neetcard'>
            <div className='buyimg'>
              <img src={buy1}/>
            </div>
            <div className='datebuy'><p>22-03-2023 to 07-05-2023</p></div>
            <div className='buynow'>
             <FaBagShopping color='white'/>
              <a href=''>

                Buy Now</a>
            </div>
            <div className='buybtn'>
              <p className='BUYPARA'>₹1200+GST</p>
              <a className='abuy' href='#wots'>View Schedule</a>
            </div>
          
        
        
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
                  <img src={i4}/>
                </div>
                <div className='textf'>
                  <p className='pref'>
                  Ranker board for every exam.
                  </p>
                </div>

              
              </div>
            </li>
      
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={f2}/>
                </div>
                <div className='textf'>
                  <p className='pref'>
                  Detached performance analysis for all exams.
                  </p>
                </div>

              </div>
            </li>
        
       
       
           
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={f3}/>
                </div>
                <div className='textf'>
                  <p className='pref'>
                 
Developed as per the latest syllabus of NEET exam.
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
                  <p className='pref'>
                  Error free solutions to all questions.
                  </p>
                </div>

              </div>
            </li>
        </ul>
        </div>
        </div>
            </div>

    </div>
  )
}

export default NeetOTS