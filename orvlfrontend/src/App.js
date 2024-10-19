//lazy loading 
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Lazy loading components
const ExamCreation = lazy(() => import('./components/Adminside/ExamCreation'));
const Topics = lazy(() => import('./components/Adminside/Topics'));
const VideoLectures = lazy(() => import('./components/VideoLectures'));
const Videolinks = lazy(() => import('./components/Adminside/Videolinks'));
const LandingPage = lazy(() => import('./frontendfolder/pages/LandingPage'));
const Ug = lazy(() => import('./frontendfolder/pages/Ug'));
const Pg = lazy(() => import('./frontendfolder/pages/Pg'));
const Jee = lazy(() => import('./frontendfolder/pages/Jee'));
const Jeets = lazy(() => import('./frontendfolder/pages/Jeets'));
const Jeeolv = lazy(() => import('./frontendfolder/pages/Jeeolv'));
const Neet = lazy(() => import('./frontendfolder/pages/Neet'));
const Neetots = lazy(() => import('./frontendfolder/pages/Neetots'));
const Neetolv = lazy(() => import('./frontendfolder/pages/Neetolv'));
const Bitsat = lazy(() => import('./frontendfolder/pages/Bitsat'));
const Ugdownloadhome = lazy(() => import('./frontendfolder/components/downloadsug/components/Ugdownloadhome'));
const JeeMainsDownloading = lazy(() => import('./frontendfolder/components/downloadsug/components/JeeMainsDownloading'));
const DownloadJEEADV = lazy(() => import('./frontendfolder/components/downloadsug/components/DownloadJEEADV'));
const Downloadneet = lazy(() => import('./frontendfolder/components/downloadsug/components/Downloadneet'));
const Olv = lazy(() => import('./frontendfolder/components/ug/compon/Olv'));
const RegisterForm = lazy(() => import('./frontendfolder/pages/RegisterForm'));
const PayRegisterForm = lazy(() => import('./frontendfolder/pages/PayRegisterform'));
const ForgetPassword = lazy(() => import('./frontendfolder/pages/ForgetPassword'));
const UserDashboard = lazy(() => import('./frontendfolder/components/user dashboard/UserDashboard'));
const MyCourses = lazy(() => import('./frontendfolder/components/user dashboard/MyCourses'));
const BuyCourses = lazy(() => import('./frontendfolder/components/user dashboard/BuyCourses'));
const MyAccount = lazy(() => import('./frontendfolder/components/user dashboard/MyAccount'));
const PaymentPage = lazy(() => import('./frontendfolder/components/user dashboard/PaymentPage'));
const CourseCreationForm = lazy(() => import('./components/Adminside/CourseCreationForm'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/Examselection' element={<ExamCreation />} />
            <Route path="/Ug" element={<Ug />} />
            <Route path="/Pg" element={<Pg />} />
            <Route path="/Jee" element={<Jee />} />
            <Route path="/Jeets" element={<Jeets />} />
            <Route path="/Jeeolv" element={<Jeeolv />} />
            <Route path="/Neet" element={<Neet />} />
            <Route path="/Neetots" element={<Neetots />} />
            <Route path="/Neetolv" element={<Neetolv />} />
            <Route path="/Bitsat" element={<Bitsat />} />
            <Route path="/Downloadmain" element={<Ugdownloadhome />} />
            <Route path="/JEEMainsDownload" element={<JeeMainsDownloading />} />
            <Route path="/JEEAdvanceDownload" element={<DownloadJEEADV />} />
            <Route path="/Downloadneet" element={<Downloadneet />} />
            <Route path="/olvug" element={<Olv />} />
            <Route path="/ForgetPassword" element={<ForgetPassword />} />
            <Route path="/Register" element={<RegisterForm />} />
            <Route path="/PayRegister" element={<PayRegisterForm />} />
            <Route path="/UserDashboard/:id" element={<ProtectedRoute element={<UserDashboard />} isAuthenticated={isAuthenticated} />} />
            <Route path="/mycourses/:id/:courseId" element={<ProtectedRoute element={<MyCourses />} isAuthenticated={isAuthenticated} />} />
            <Route path="/MyCourses/:id" element={<ProtectedRoute element={<MyCourses />} isAuthenticated={isAuthenticated} />} />
            <Route path="/BuyCourses/:id" element={<ProtectedRoute element={<BuyCourses />} isAuthenticated={isAuthenticated} />} />
            <Route path="/MyAccount/:id" element={<ProtectedRoute element={<MyAccount />} isAuthenticated={isAuthenticated} />} />
            <Route path="/PayCourse/:courseId" element={<ProtectedRoute element={<PaymentPage />} isAuthenticated={isAuthenticated} />} />
            <Route path='/topics' element={<Topics />} />
            <Route path='/videolectures' element={<VideoLectures />} />
            <Route path='/videolinks' element={<Videolinks />} />
            <Route path='/courseCreationForm' element={<CourseCreationForm />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App; 