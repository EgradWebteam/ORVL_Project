import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Olvug.css'
import logo from '../Images/logo1.jpg'
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../Images/new landingbanner.d7950e84542985b05647 (1).png'
import banner2 from '../Images/BITSAT CRASH COURSE BANNER.31778deec7f60b0f0d30.jpg'
import banner3 from '../Images/JEE ADVANCED MATHEMATICS WEB BANNER 1.97dcff1bd19ee3dd03f6.jpg'
import banner4 from '../Images/NEET Banner - 2.c2bae78eeb8f65413d04.jpg'
import course from '../Images/course123.jpg'
import { IoBarChartSharp } from "react-icons/io5";
import { CgShapeRhombus } from "react-icons/cg";
import { PiFileTextFill } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import OlvFooter from './OlvFooter';
import { RxCross2 } from "react-icons/rx";
const Olv = () => {
    const [examscourse, setExamscourse] = useState([]);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isLoginVisible, setLoginVisible] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [loginError, setLoginError] = useState('');
    useEffect(() => {
        // Check if the URL hash is "#LOGIN"
        if (window.location.hash === '#LOGIN') {
            setLoginVisible(true); // Show login modal if hash is "#LOGIN"
        }
      
        // Optional: Handle hash change
        const handleHashChange = () => {
            if (window.location.hash === '#LOGIN') {
                setLoginVisible(true);
            } else {
                setLoginVisible(false);
            }
        };
      
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
      }, []);
      const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
      };
      
      const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError(''); // Reset error message
      
        try {
            const response = await axios.post('http://localhost:8000/login/login', loginData);
            alert(response.data.message);
            const userId = response.data.userId; // Get the user ID
      const userRole = response.data.role; // Get the user role
            const token = response.data.token; // Assuming your API returns token and userId
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);
            if (userRole === 'admin') {
                navigate('/Examselection');
            } else {
            
              if (userId) {
                  navigate(`/UserDashboard/${userId}`);
                  setIsAuthenticated(true)
              } else {
                  setLoginError('User ID not found.');
              }
          } 
        } catch (error) {
            setLoginError('Invalid email or password. Please try again.');
        }
      };
      
      
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http://localhost:8000/course/exams_main');
                setExamscourse(response.data);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
    }, []);
    const formatDate = (dateString) => {
        
        if (!dateString) {
           
            const defaultDate = new Date();
            return `${defaultDate.getDate().toString().padStart(2, '0')}-${(defaultDate.getMonth() + 1).toString().padStart(2, '0')}-${defaultDate.getFullYear()}`;
        }
    
        const date = new Date(dateString);
       
        if (isNaN(date.getTime())) {
            const defaultDate = new Date(); 
            return `${defaultDate.getDate().toString().padStart(2, '0')}-${(defaultDate.getMonth() + 1).toString().padStart(2, '0')}-${defaultDate.getFullYear()}`;
        }
    
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const handleBuyNow = (exam) => {
        navigate('/PayRegister', { state: { exam } });
    };
  return (
    <div>
        <header>
            <div className="mainheader">
                <div className="upheader">
                <a className='uhanc' href="tel:7993270532">7993270532</a> / <a className='uhanc'  href="mailto:info@egradtutor.in ">info@egradtutor.in </a> 
                </div>
                <div className="downheader">
                    <div className="navlistug">
                        <div className="imglogo">
                            <img src={logo} alt="asd" />
                        </div>
                        <ul className="navlistul">
                            <li><a href="/">HOME</a></li>
                            <li><a href="">ABOUT US</a></li>
                            <li><a href="#features">FEATURES</a></li>
                            <li><a href="">VIDEO PACKAGES</a></li>
                            <li> <a href="#LOGIN" onClick={() => {setLoginVisible(true);}}> LOGIN</a> </li>
                            <li><a href="/Register">REGISTER</a></li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        <div className='Sliderolv'>
            <Carousel
            className='Slider1'
            autoPlaySpeed={2}
            autoPlay={true}
            infiniteLoop={true}
            >
               
            <li>
                <div className='slide1'>
                    <img src={banner1} className='olvci'></img>
                </div>
            </li>
            <li>
          
            <div className='slide1'>
                <img src={banner2} className='olvci'></img>
                </div>
            </li>
            <li>
                <div className='slide1'>
                <img src={banner3} className='olvci'></img>
                </div>
            </li>
            <li>
                <div className='slide1'>
                <img src={banner4} className='olvci'></img>
                </div>
            </li>
           
            </Carousel>
            </div>
            <div className="main-contentolv" id="features">
                <div className="headfeatures">
                <div className="headvidfet"><h3> Why Choose Us</h3><div className='rhombuses'><CgShapeRhombus className='cdr' /><CgShapeRhombus className='cdr'  /> </div> </div>
                <div className="paravidfet">
                See Why one should choose this platform for exam preparation.
                </div>
                </div>
                <div className="featurebody">
                    <div className="featurevideocards">
                        <div className="fearvidcard">
                            <div className="fvcin">
                                    <div className="fvincimg">
                                    <IoBarChartSharp />
                                    </div>
                                    <div className="fvchead">
                                    PERFORMANCE ANALYSIS
                                    </div>
                                    <div className="fvcbody">
                                   <p>Students can receive their detailed performance analysis and All India Ranking for all the tests.</p> 
                                    </div>
                            </div>

                        </div>
                        <div className="fearvidcard">
                            <div className="fvcin">
                                    <div className="fvincimg">
                                    <PiFileTextFill />
                                    </div>
                                    <div className="fvchead">
                                    TIME MANAGEMENT
                                    </div>
                                    <div className="fvcbody">
                                    <p> Students receive a time management report by pointing out their least and most time consuming areas. This helps the students to increase their overall problem solving speed and skill.  </p> 
                                    </div>
                            </div>

                        </div>
                        <div className="fearvidcard">
                            <div className="fvcin">
                                    <div className="fvincimg">
                                    <FaUsers />
                                    </div>
                                    <div className="fvchead">
                                    CONFIDENCE BOOSTER
                                    </div>
                                    <div className="fvcbody">
                                   <p>Our tests provide a sound examination of concepts that boost the confidence in students for test taking. Our test reports help the students to identify their weak areas to improve themselves.</p> 
                                    </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="popcourses">
            <div className="headfeatures popcorhead">
                <div className="headvidfet"><h3>Popular courses</h3><div className='rhombuses'><CgShapeRhombus className='cdr' /><CgShapeRhombus className='cdr'  /> </div> </div>
                <div className="paravidfet">
                Choose your course and get started.
                </div>
                </div>
                <div className="exam-cards-containervl">
    {examscourse.map((examcos) => (
        <div className="exam-cardvl" key={examcos.course_id}>
            <div className="imgsrc"><img src={`data:image/jpeg;base64,${examcos.image}` } alt="img" /></div>
          <div className="headec"><h5>{examcos.course_name}</h5></div>  
          <div className="fsvnsv subcardgrid valinosubvid">  <div className='fsvnsv subhcard'>Validity: <div>{formatDate(examcos.end_date)}</div> </div>
            {/* <div className='fsvnsv subhcard'>no of subjects<div>{examcos.subject_count}</div></div> */}
            <div className='fsvnsv'>no of Videos: <div>{examcos.video_count}</div></div></div>
           
           <div className="comcardbuyprice"><div className='fsvnsv  pricebuy'> ${examcos.total_price}</div> <button className="btnbut" onClick={() => handleBuyNow(examcos)}>BUY NOW</button>
        </div></div> 
    ))}
</div>
            </div>
         
            {isLoginVisible && (
                <div className="modal-overlay" id="LOGIN" >
                    <div className="modal-content" >
                        <h2 className='lgnh2'>Login</h2>
                        {loginError && <p className="error">{loginError}</p>}
                        <form onSubmit={handleLoginSubmit}>
                        <div className="loginitems">
                            <div>
                              
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='email'
                                    className='inptnv'
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            <div>
                               
                                <input
                                    type="password"
                                    name="password"
                                    placeholder='password'
                                    className='inptnv'
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            </div>
                            <button type="submit" className='buttonlgnsubmit'>Login</button>
                          
                        </form>
                        <div className="newforgetpass">
                          <div className="newreg">
                           new here? <a  className ="pnrc" href="http://localhost:3000/Register">register</a>
                          </div>
                          <div className="gordetpassword"><a  className ="pnrc" href="/ForgetPassword">forget password?</a></div>
                        </div>
                        <button className='closebuttonlogin' onClick={() => setLoginVisible(false)}><RxCross2 /></button>
                    </div>
                </div>
            )}
            <OlvFooter/>
    </div>
    
  )
}

export default Olv