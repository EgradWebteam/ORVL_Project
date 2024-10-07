import React, { useState } from "react";
import Logo_img from '../images/image.png'
import { IoMdHome } from "react-icons/io";
import slide1 from '../images/slide1.jpg'
import slide2 from '../images/slide2.jpg'
import slide3 from '../images/slide3.jpg'
import { Carousel } from 'react-responsive-carousel';
import '../stylesjee/JeeolvHeader.css'
import olc1 from '../images/olc1.png'
import olc2 from '../images/olc2.png'
import olc3 from '../images/olc3.png'
import olc4 from '../images/olc4.png'
import olc5 from '../images/olc5.png'
import olc6 from '../images/olc6.png'
import { MdDownload } from "react-icons/md";
import ocog from '../images/oco_grid_img.png'
import gtutor from '../images/tutorg.png'
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import hoc1 from '../images/hoc1.png'
import hoc2 from '../images/hoc2.png'
import hoc3 from '../images/hoc3.png'
import hoc4 from '../images/hoc4.png'
import fac1 from '../images/fac1.png'
import fac2 from '../images/fac2.png'
import fac3 from '../images/fac3.png'
const JeeolvHeader = () => {
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);

  const toggleModal13 = () => {
    setModal1(!modal1);
  };

  const toggleModal21 = () => {
    setModal2(!modal2);
  };
  return (
    <div className='mainolv'>
      <div className='headerf'>
        <div className='headerjee'>
          <img src={Logo_img} />
        </div>
        <a className='jeeanchor' href='/Home'>
          <IoMdHome /> Home
        </a>
      </div>
      <div className='divboxts'>
        <h1 className='jeetsh1'>
          JEE (MAINS + ADVANCED) ONLINE LIVE CLASSES
        </h1>
      </div>
      <div className='Carousel'>
        <Carousel className='Slider'
          autoPlaySpeed={2}
          autoPlay={true}
          infiniteLoop={true}>

          <li>
            <div className='slide'>
              <img src={slide1}></img>
            </div>
          </li>
          <li>

            <div className='slide'>
              <img src={slide2}></img>
            </div>
          </li>
          <li>
            <div className='slide'>
              <img src={slide3}></img>
            </div>
          </li>

        </Carousel>
      </div>
      <div className='olcmain'>
        <div className='olc'>
          <h2>ONLINE LIVE CLASSES</h2>
          <div className='olccardmain'>
            <div className='olscards'>
              <div className='olccard'>
                <div className='cardol co1'>
                  <div className='imgolc'>
                    <img src={olc1} />
                  </div>
                  <div className='textolc'>
                    <p>Students can also use this course for preparation of otherengineering exams.</p>
                  </div>
                </div>
              </div>
              <div className='olccard'>
                <div className='cardol'>
                  <div className='imgolc'>
                    <img src={olc2} />
                  </div>
                  <div className='textolc'>
                    <p>Live interaction with expert faculty helps students to understand the areas of improvement.</p>
                  </div>
                </div>
              </div>
              <div className='olccard'>
                <div className='cardol'>
                  <div className='imgolc'>
                    <img src={olc3} />
                  </div>
                  <div className='textolc'>
                    <p>
                      Live online video classes allow interaction with students through chats and comments.</p>
                  </div>
                </div>
              </div>
              <div className='olccard'>
                <div className='cardol'>
                  <div className='imgolc'>
                    <img src={olc4} />
                  </div>
                  <div className='textolc'>
                    <p>Helps students to understand complex information through immediate answers to questions.</p>
                  </div>
                </div>
              </div>
              <div className='olccard'>
                <div className='cardol'>
                  <div className='imgolc'>
                    <img src={olc5} />
                  </div>
                  <div className='textolc'>
                    <p>

                      4 to 5 months of continuous classes and practice through Sunday test sessions, will improve students confidence and lead them to success.</p>
                  </div>
                </div>
              </div>
              <div className='olccard'>
                <div className='cardol'>
                  <div className='imgolc'>
                    <img src={olc6} />
                  </div>
                  <div className='textolc'>
                    <p>Students can also use this course for preparation of other engineering exams.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className='oco'>
        <div className='oco_sub'>
          <div className='oco_head'>
            <h2>ONLINE CLASSES OFFERED</h2>
            <a href='https://www.egradtutor.in/static/media/jee_poster_2023-9-1.11fc6013161ad21a7c15.pdf'>DOWNLOAD COURSE BROCHURE <MdDownload /></a>
          </div>
          <div className='oco_griding'>
            <div className='oco_maincard'>
              <div className='oco_card_head'>
                <h3>IIT-JEE MAINS & ADVANCED - 2025</h3>
                <h3>ONLINE LIVE CLASSES</h3>
              </div>
              <div className='oco_grid'>
                <div className='oco_grid_head'>
                  <h4>MATHEMATICS</h4>
                  <h4>PHYSICS</h4>
                  <h4>CHEMISTRY</h4>
                </div>

                <div className='oco_grid_img'>
                  <img src={ocog} />
                </div>
              </div>
              <div className='btno'>
                <button className='btn1' onClick={toggleModal13}>KNOW MORE
                </button>
                {modal1 && (
                  <div className='modal'>
                    <div className='overlay'></div>
                    <div className='content_m'>

                      <p>For Student entering class 12/Long-term</p>
                      <button className='closebutton' onClick={toggleModal13}><RxCross2 /></button>
                    </div>
                  </div>

                )}
                <a href='https://pages.razorpay.com/pl_NzFk22IekGZj2g/view' ><button className='btn1'  >FEES STRUCTURE
               </button> </a>
                <button className='btn1' onClick={toggleModal21}>SCHEDULE</button>
                {modal2 && (
                  <div className='modal'>
                    <div className='overlay'></div>
                    <div className='content_m'>
                      <div className="conh">
                        <h4 className="conhh4">MORNING BATCH</h4>
                      </div>
                      <h4 className="conhh4" ><span className="redspan">SUBJECTS :</span> MATHEMATICS, PHYSICS, CHEMISTRY</h4>
                      <div className="boxgrid">
                        <div className="boxol">
                          <span className="coyel">Mathematics : </span>6:00 AM to 7:00 AM
                        </div>
                        <div className="boxol">
                          <span className="coyel">Physics : </span>5:00AM to 6:00 AM <br />
                          Monday - Wednesday
                        </div>
                        <div className="boxol">
                          <span className="coyel">Chemistry : </span>5:00AM to 6:00 AM <br />
                          Thursday - Saturday
                        </div>
                      </div>
                      <div className="popgrid">
                        <div className="poppara">

                          <b>Ongoing :</b>
                          <p> 6th February, 2024
                          </p>

                        </div>
                        <div className="poppara">

                          <b>Next Enrollment :</b>
                          <p> 26th February, 2024<br />
                            25th March, 2024
                          </p>

                        </div>
                      </div>

                      <button className='closebutton' onClick={toggleModal21}><RxCross2 /></button>
                    </div>
                  </div>

                )}



              </div>
            </div>

            <div className='ocoimg'>
              <img src={gtutor} />
            </div>

          </div>
        </div>

      </div>
      <div className="hoc">
        <div className="hoc_sub">
          <h2>HIGHLIGHTS OF THE COURSE</h2>
          <div className="hoc_flex">
            <div className="hoccard">
              <div className="hocimg hocimg1">
                <img src={hoc1}/>
                </div>
                <div className="hoctext">
                  <h3>LIVE LECTURES</h3>  
                </div>
            
            </div>
            <div className="hoccard">
              <div className="hocimg hocimg2">
                <img src={hoc2}/> </div>
                <div className="hoctext">
                  <h3>STUDY MATERIAL</h3>
                </div>
             
            </div>
            <div className="hoccard">
              <div className="hocimg hocimg3">
                <img src={hoc3}/>   </div>
                <div className="hoctext">
                  <h3>ONLINE TEST SERIES</h3>
             
              </div>
            </div>
            <div className="hoccard">
              <div className="hocimg hocimg4">
                <img src={hoc4}/>   </div>
                <div className="hoctext">
                  <h3>ONE - ONE DOUBT CLARIFICATION</h3>
                </div>
              </div>
           
          </div>
        </div>

      </div>
      <div className="facultymain">
        <div className="faculty_sub">
          <h2>COURSE FACULTY</h2>
          <div className="facultyflex">
            <div className="faculty">
              <div className="facimg">
                <img src={fac1}/>
              </div>
              <div className="facpara">
                <p>Name: <span className="colororgpinl">Prusty Laxmi Narayan</span></p>
                <p>Qualification: <span className="colororgpinl"> (BTech, IIT KGP)</span></p>
                <p>Subject: <span className="colororgpinl">Physics</span></p>
              
              </div>
            </div>
            <div className="faculty">
              <div className="facimg">
                <img src={fac2}/>
              </div>
              <div className="facpara">
                <p>Name: <span className="colororgpinl">Kalyan Dutt</span></p>
                <p>Qualification: <span className="colororgpinl"> (BTech, IITD)</span></p>
                <p>Subject: <span className="colororgpinl">Physics</span></p>
              
              </div>
            </div>
            <div className="faculty">
              <div className="facimg">
                <img src={fac3}/>
              </div>
              <div className="facpara">
                <p>Name: <span className="colororgpinl">Pavan Kumar Kasibhotla</span></p>
                <p>Qualification: <span className="colororgpinl"> (BTech, IITH)</span></p>
                <p>Subject: <span className="colororgpinl">Maths, Physics & Chemistry</span></p>
              
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  )
}

export default JeeolvHeader