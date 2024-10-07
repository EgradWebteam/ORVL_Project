import React from 'react'
import Logo_img from '../images/image.png'
import { IoMdHome } from "react-icons/io";
import '../stylesjee/Ugjeetsheader.css'
import io from '../images/img1.png'
import iy from '../images/img2.png'
import i3 from '../images/img3.png'
import i4 from '../images/img4.png'
import { FaBagShopping } from "react-icons/fa6";
import buy1 from '../images/buy1.png'
import buy2 from '../images/buy2.png'
import buy3 from '../images/buy3.png'
import buy4 from '../images/buy4.png'
import buy5 from '../images/buy5.png'

const Ugjeetsheader = () => {
  return (
    <div className='mainf'>
      <div className='headerf'>
         <div className='headerjee'>
            <img src = {Logo_img} />
         </div>
          <a className='jeeanchor' href='/Home'>
          <IoMdHome /> Home
          </a>
          </div>
          <div className='divboxts jeetsh111'>
        <h1 className='jeetsh1'>
        JEE - ONLINE TEST SERIES
        </h1>
        </div>
      <div className='dpjts'>
        <pre className='parajeets'>Preparing well for the exam and attempting the exam successfully is one of the greatest desires for all the students. Many students will not be able to attempt IIT-JEE on the<br/>
       examination day as they do not have the right resources and proper guidance for the preparation.  Our online test series makes your understanding stronger and helps you to<br/>
       challenge yourself in an environment that resembles the final examination. Challenger test series - as the name suggest, challenges the students’ abilities to attain the best by<br/>
       answering the toughest questions. With our online test series, channel your skills towards the desired success.</pre>

     </div>
      <div className='wotsbg' id='wots'>
      <div className='wots'>
        <div className='wotsm'>
          <h2 className='wotsh2'>WHY ONLINE TEST SERIES?</h2>
          <ul className='ulwots'>
            <li className='liots'>
              <div className='wotsimg'>
                <img src={io}/>
              </div>
              <p className='pwots'>Our performance analysis helps you understand the areas of improvement.</p>
            </li>
            <li className='liots'>
              <div className='wotsimg'>
                <img src={iy } />
              </div>
              <p className='pwots'>It will help in improving paper solving speed.</p>
            </li>
            <li className='liots'>
              <div className='wotsimg'>
                <img src={i3}/>
              </div>
              <p className='pwots'>Appearing in these tests will improve the overall preparation and will increase the chances of getting a good score.</p>
            </li>
            <li className='liots'>
              <div className='wotsimg'>
                <img src={i4}/>
              </div>
              <p className='pwots'>Our online test series helps you know your understanding of the subject so that you can put efforts in the right direction.</p>
            </li>
          </ul>
        </div>
      </div>
      </div>
      

      <div className='buyjee'>
          <h2 className='buyh2'>BUY ONLINE TEST SERIES</h2>
          <div className='buyjees'>
            <div className ='buycard'>
            <div className='buyimg'>
              <img src={buy1}/>
            </div>
            <div className='datebuy'><p>22-03-2023
                   to
                31-07-2023</p></div>
            <div className='buynow'>
             <FaBagShopping color='white'/>
              <a href=''>

                Buy Now</a>
            </div>
            <div className='buybtn'>
              <p className='BUYPARA'>₹5000+GST</p>
              <a className='abuy' href='#wots'>View Schedule</a>
            </div>
          
        </div>
        <div className ='buycard'>
            <div className='buyimg'>
              <img  src={buy2}/>
            </div>
            <div className='datebuy'><p>22-03-2023
                   to
                31-07-2023</p></div>
            <div className='buynow'>
             <FaBagShopping color='white'/>
              <a href=''>

                Buy Now</a>
            </div>
            <div className='buybtn'>
              <p className='BUYPARA'>₹2000+GST</p>
              <a className='abuy' href='#wots'>View Schedule</a>
            </div>
          </div>
        
        <div className ='buycard'>
            <div className='buyimg'>
              <img  src={buy3}/>
            </div>
            <div className='datebuy'><p>22-03-2023
                   to
                31-07-2023</p></div>
            <div className='buynow'>
             <FaBagShopping color='white'/>
              <a href=''>

                Buy Now</a>
            </div>
            <div className='buybtn'>
              <p className='BUYPARA'>₹2000+GST</p>
              <a className='abuy' href='#wots'>View Schedule</a>
            </div>
          </div>
          <div className ='buycard'>
            <div className='buyimg'>
              <img  src={buy4} />
            </div>
            <div className='datebuy'><p>22-03-2023
                   to
                31-07-2023</p></div>
            <div className='buynow'>
             <FaBagShopping color='white'/>
              <a href=''>

                Buy Now</a>
            </div>
            <div className='buybtn'>
              <p className='BUYPARA'>₹2000+GST</p>
              <a className='abuy' href='#wots'>View Schedule</a>
            </div>
          </div>
          <div className ='buycard'>
            <div className='buyimg'>
              <img  src={buy5}/>
            </div>
            <div className='datebuy'><p>22-03-2023
                   to
                31-07-2023</p></div>
            <div className='buynow'>
             <FaBagShopping color='white'/>
              <a href=''>

                Buy Now</a>
            </div>
            <div className='buybtn'>
              <p className='BUYPARA'>₹2000+GST</p>
              <a className='abuy' href='#wots'>View Schedule</a>
            </div>
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
                  <img src={io}/>
                </div>
                <div className='textf'>
                  <p className='pref'>
                  Gives you sufficient time to
                consolidate on your JEE
                  Mains & JEE Advanced preparation.
                  </p>
                </div>

              
              </div>
            </li>
      
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={iy}/>
                </div>
                <div className='textf'>
                  <p className='pref'>
                  His test series helps you to eliminate
                   conceptual doubts and plugs in any
                      gaps in your preparation.
                  </p>
                </div>

              </div>
            </li>
        
       
       
           
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={i3}/>
                </div>
                <div className='textf'>
                  <p className='pref'>
                  Gives you several chances to appear
                  in simulated JEE like environment to
                   help you develop better time 
                      management skills.
                  </p>
                </div>

              
              </div>
            </li>
   
            <li className='fcard'>
              <div className='fcarddis'>
                <div className='imgf'>
                  <img src={i4}/>
                </div>
                <div className='textf'>
                  <p className='pref'>
                  Courses designed to challenge and 
                   test the students learning and 
                   understanding of the subjects.
                  </p>
                </div>

              </div>
            </li>
        </ul>
        </div>
        </div>
            </div>
        
   
  )
}

export default Ugjeetsheader