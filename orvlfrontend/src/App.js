import React,{useState,useEffect} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ExamCreation from './components/Adminside/ExamCreation';
import Topics from './components/Adminside/Topics';
import VideoLectures from './components/VideoLectures';
import Videolinks from './components/Adminside/Videolinks';
import Header from './frontendfolder/components/landingpage/header/Header';
import Main from './frontendfolder/components/landingpage/main/Main'
import Footer from './frontendfolder/components/landingpage/footer/Footer'
import LandingPage from './frontendfolder/pages/LandingPage';
import Ug from './frontendfolder/pages/Ug';
import Pg from './frontendfolder/pages/Pg';
import { Navigate } from 'react-router-dom';
import Jee from './frontendfolder/pages/Jee';
import Jeets from './frontendfolder/pages/Jeets';
import Jeeolv from './frontendfolder/pages/Jeeolv';
import Neet from './frontendfolder/pages/Neet';
import Neetots from './frontendfolder/pages/Neetots';
import Neetolv from './frontendfolder/pages/Neetolv';
import Bitsat from './frontendfolder/pages/Bitsat';
import Downloadmain from './frontendfolder/components/downloadsug/components/Downloadmain'
import JeeMainsDownloading from './frontendfolder/components/downloadsug/components/JeeMainsDownloading';
import JeeAdvanceDownload from './frontendfolder/components/downloadsug/components/JeeAdvanceDownload';
import Ugdownloadhome from './frontendfolder/components/downloadsug/components/Ugdownloadhome';
import DownloadJEEADV from './frontendfolder/components/downloadsug/components/DownloadJEEADV';
import Downloadneet from './frontendfolder/components/downloadsug/components/Downloadneet';
import Olv from './frontendfolder/components/ug/compon/Olv';
import RegisterForm from './frontendfolder/pages/RegisterForm';
import ForgetPassword from './frontendfolder/pages/ForgetPassword';
import UserDashboard from './frontendfolder/components/user dashboard/UserDashboard';
import MyCourses from './frontendfolder/components/user dashboard/MyCourses';
import BuyCourses from './frontendfolder/components/user dashboard/BuyCourses';
import MyAccount from './frontendfolder/components/user dashboard/MyAccount';
import PayRegisterForm from './frontendfolder/pages/PayRegisterform';
import ProtectedRoute from './ProtectedRoute';
import CourseCreationForm from './components/Adminside/CourseCreationForm';
import PaymentPage from './frontendfolder/components/user dashboard/PaymentPage';


 
 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const userId = localStorage.getItem('userId');
  useEffect(() => {
      // Check localStorage or other method to set isAuthenticated
      const token = localStorage.getItem('authToken');
      if (token) {
          setIsAuthenticated(true);
      }
  }, []);
  return (
    <div>
  
  <BrowserRouter>
  <Routes>
  <Route path='/' element={<LandingPage/>} />

           
  <Route path='/Examselection' element={<ExamCreation/>} />
           <Route path="/Ug" element={<Ug/>} />
           <Route path="/Pg" element={<Pg/>} />
           <Route path="/Jee" element={<Jee/>} />
           <Route path="/Jeets" element={<Jeets/>} />
           <Route path="/Jeeolv" element={<Jeeolv/>} />
           <Route path="/Neet" element={<Neet/>} />
           <Route path="/Neetots" element={<Neetots/>} />
           <Route path="/Neetolv" element={<Neetolv/>} />
           <Route path="/Bitsat" element={<Bitsat/>} />
           <Route path="/Downloadmain" element={<Ugdownloadhome/>} />
           <Route path="/JEEMainsDownload" element={<JeeMainsDownloading/>} />
           <Route path="/JEEAdvanceDownload" element={<DownloadJEEADV/>} />
           <Route path="/Downloadneet" element={<Downloadneet/>} />
           <Route path="/olvug" element={<Olv/>} />
           <Route path="/ForgetPassword" element={<ForgetPassword/>} />
           <Route path="/Register" element={<RegisterForm/>} />
           <Route path="/PayRegister" element={<PayRegisterForm/>} />

           <Route path="/UserDashboard/:id" element={<ProtectedRoute element={<UserDashboard />} isAuthenticated={isAuthenticated} />} />
                    <Route path="/MyCourses/:id" element={<ProtectedRoute element={<MyCourses />} isAuthenticated={isAuthenticated} />} />
                    <Route path="/BuyCourses/:id" element={<ProtectedRoute element={<BuyCourses />} isAuthenticated={isAuthenticated} />} />
                    <Route path="/MyAccount/:id" element={<ProtectedRoute element={<MyAccount />} isAuthenticated={isAuthenticated} />} />
                    <Route path="/PayCourse/:courseId" element={<ProtectedRoute element={<PaymentPage/>} isAuthenticated={isAuthenticated} />} />

    <Route path = '/topics' element={<Topics/>}/>
    <Route path = '/videolectures' element={<VideoLectures/>}/>
    <Route path = '/videolinks' element={<Videolinks/>}/>
    <Route path = '/courseCreationForm' element={<CourseCreationForm/>}/>
  </Routes>
  </BrowserRouter>

  
</div>
  );
}
 
export default App;
 