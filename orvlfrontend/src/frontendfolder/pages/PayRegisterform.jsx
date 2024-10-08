import React, { useState,useEffect } from 'react';
import axios from 'axios';
import OlvFooter from '../components/ug/compon/OlvFooter';
import logo from '../components/ug/Images/logo1.jpg';
import { RxCross2, RxFontSize } from "react-icons/rx";
import { useNavigate,useLocation} from 'react-router-dom';
import '../components/ug/styles/Register.css'

 
const countries = [
  { value: '', label: 'Select Country' },
  { value: 'usa', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'india', label: 'India' },
  { value: 'australia', label: 'Australia' },
  { value: 'germany', label: 'Germany' },
  { value: 'france', label: 'France' },
  { value: 'china', label: 'China' },
  // Add more countries as needed
];

const branches = [
  { value: '', label: 'Select Course' },
  { value: 'JEE-Mains', label: 'JEE-Mains' },
  { value: 'JEE-Advance', label: 'JEE-Advance' },
  { value: 'Neet', label: 'Neet' },
  { value: 'BITSAT', label: 'BITSAT' },
  { value: 'VITEEE', label: 'VITEEE' },
  // Add more branches as needed
];
 
const coachingOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
 
const PayRegisterForm = () => {
  // const navigate = useNavigate();
  const [modal213, setModal213] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { exam } = location.state || {};
  const [formData, setFormData] = useState({
    name: '',
    fathername: '',
    mobile_no: '',
    gender: '',
    email: '',
    dob: '',
    present_streetadd: '',
    present_addressline2: '',
    present_city: '',
    present_state: '',
    present_zipcode: '',
    present_country: '',
    permanent_streetadd: '',
    permanent_addressline2: '',
    permanent_city: '',
    permanent_state: '',
    permanent_zipcode: '',
    permanent_country: '',
    tenth_percentage: '',
    twelfth_percentage: '',
    btech_percentage: '',
    university_roll_no: '',
    college_city: '',
    college_state: '',
    college_name: '',
    branch: '',
    profile_photo:null,
    tenth_certificate: null,
    twelfth_certificate: null,
    btech_certificate: null,
    coaching: '',
    batch: '',
    rollno: '',
    centername: '',
    password:''
  });
  const [isEmailExistModalOpen, setEmailExistenceModalOpen] = useState(false);
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [loginData, setLoginData] = useState({
      email: '',
      password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [errors, setErrors] = useState({});
 
  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
 
    if (type === 'file') {
      const file = files[0];
      if (file && file.size > MAX_FILE_SIZE) {
        alert('File size exceeds the 5MB limit.');
        return;
      }
      setFormData(prevState => ({
        ...prevState,
        [name]: file
      }));
    } else if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: checked
      }));
    } else {
      // Validate input value for phone number and ZIP code
      if (name === 'mobile_no') {
        if (!/^\d{0,10}$/.test(value)) {
          return; // Ignore input if it does not match
        }
      } else if (name === 'present_zipcode' || name === 'permanent_zipcode') {
        if (!/^\d{0,6}$/.test(value)) {
          return; // Ignore input if it does not match
        }
      }
 
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
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
  const validateForm = () => {
    const newErrors = {};
    console.log("Validating form...");
    const phonePattern = /^[0-9]{10}$/; // Regular expression for exactly 10 digits
    const zipPattern = /^[0-9]{6}$/;
 
    for (const [key, value] of Object.entries(formData)) {
      console.log(`Checking field ${key}: ${value}`);
     
        if (key === 'mobile_no' && !phonePattern.test(value)) {
          newErrors[key] = 'Mobile number must be exactly 10 digits and contain only numbers';
        } else if (key === 'present_zipcode' && !zipPattern.test(value)) {
          newErrors[key] = 'Present ZIP code must be exactly 6 digits';
        } else if (key === 'permanent_zipcode' && !zipPattern.test(value)) {
          newErrors[key] = 'Permanent ZIP code must be exactly 6 digits';
        // } else if (!value && key !== 'permanent_state') { // Adjust as needed to handle optional fields
        //   newErrors[key] = 'This field is required';
      }
    }
    if (formData.coaching === 'yes') {
      // Validate additional fields when coaching is yes
      if (!formData.batch) newErrors.batch = 'Batch is required';
      if (!formData.rollno) newErrors.rollno = 'Roll No is required';
      if (!formData.centername) newErrors.centername = 'Center Name is required';
    }
 
    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        console.log("Validation failed.");
        console.log("Form Data:", formData);
        console.log("Errors:", errors);
        return;
    }

    console.log('Form data before submit:', formData);

    const formDataToSend = new FormData();
    for (const key in formData) {
        if (formData[key] !== null && formData[key] !== '') {
            if (formData.coaching === 'no' && ['batch', 'rollno', 'centername'].includes(key)) {
                continue;
            }
            formDataToSend.append(key, formData[key]);
        }
    }

    try {
        const response = await axios.post('http://localhost:8000/register/register', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('Response from server:', response.data);

        if (response.data.message === "Email already registered. Please log in.") {
            setEmailExistenceModalOpen(true);
            setLoginVisible(true);
        } else {
            alert('Registration successful!');
            setLoginVisible(true);
            
      
        }
        setFormData({
          name: '',
          fathername: '',
          mobile_no: '',
          gender: '',
          email: '',
          dob: '',
          present_streetadd: '',
          present_addressline2: '',
          present_city: '',
          present_state: '',
          present_zipcode: '',
          present_country: '',
          permanent_streetadd: '',
          permanent_addressline2: '',
          permanent_city: '',
          permanent_state: '',
          permanent_zipcode: '',
          permanent_country: '',
          tenth_percentage: '',
          twelfth_percentage: '',
          btech_percentage: '',
          university_roll_no: '',
          college_city: '',
          college_state: '',
          college_name: '',
          branch: '',
          profile_photo:null, 
          tenth_certificate: null,
          twelfth_certificate: null,
          btech_certificate: null,
          coaching: '',
          batch: '',
          rollno: '',
          centername: ''
        });
  
  
        console.log("Form has been reset.");

    } catch (error) {
        console.error('Error response:', error.response);

        if (error.response && error.response.status === 400) {
            if (error.response.data.message === "Email already registered. Please log in.") {
                setEmailExistenceModalOpen(true);
            } else {
                alert('Error during registration: ' + error.response.data.message);
            }
        } else {
            console.error('Error registering user:', error);
            alert('Error registering user!');
        }
    }
};


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

      // Navigate based on user role
      if (response.data.role === 'admin') {
          navigate('/Examselection');
      } else {
        const userId = response.data.userId; // Change this to userId
        console.log('User ID:', userId); // Log the user ID
        
        if (userId) {
            navigate(`/UserDashboard/${userId}`);
        } else {
            setLoginError('User ID not found.');
        }
    } 
  } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
  }
};

  // const handleUserData = () => {
  //   navigate('/UserData');
  // };
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
                            <li> <a href="#LOGIN" onClick={() => {
                          
                            setLoginVisible(true);
                        }} >LOGIN</a> </li>
                            <li><a href="/Register">REGISTER</a></li>
                           
                        </ul>
                    </div>
                </div>
            </div>
        </header>
        <div>
      
            {exam && (
                <div className='coursedetails'>
                    <h1 className='vlfh1'>Course Details :</h1>
                <div className='coursedetailsfw'>
                    
                    <p><span className='boldfcd'>Course Name : </span>{exam.course_name}</p>
                    <p><span className='boldfcd'>Price: $</span>{exam.total_price}</p>
                    <p><span className='boldfcd'>Validity: </span>{formatDate(exam.end_date)}</p>
                    {/* <p><span className='boldfcd'>Number of Subjects: </span>{exam.subject_count}</p> */}
                    <p><span className='boldfcd'>Number of Videos: </span>{exam.video_count}</p>
                </div>
                </div>
            )}
        </div>
      <form onSubmit={handleSubmit} className='registerform'>
        <h1 className='vlfh1'>VIDEO LECTURES STUDENT REGISTRATION FORM</h1>
        <h2 className='vlfh2'>PERSONAL INFORMATION</h2>
        <div className="form-section">
          <div className="form-row">
            <div className={`form-group ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">Name: <span className="required-asterisk">*</span></label>
              <input type="text" className='inptnv' id="name" name="name" value={formData.name} onChange={handleChange} required />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className={`form-group ${errors.fathername ? 'error' : ''}`}>
              <label htmlFor="fathername">Father's Name: <span className="required-asterisk">*</span></label>
              <input type="text"  className='inptnv' id="fathername" name="fathername" value={formData.fathername} onChange={handleChange} required />
              {errors.fathername && <span className="error-message">{errors.fathername}</span>}
            </div>
            <div className={`form-group ${errors.dob ? 'error' : ''}`}>
              <label htmlFor="dob">Date of Birth: <span className="required-asterisk">*</span></label>
              <input type="date"  className='inptnv' id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group ${errors.gender ? 'error' : ''}`}>
              <label htmlFor="gender">Gender: <span className="required-asterisk">*</span></label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
            <div className={`form-group ${errors.mobile_no ? 'error' : ''}`}>
              <label htmlFor="mobile_no">Mobile No: <span className="required-asterisk">*</span></label>
              <input type="text"  className='inptnv' id="mobile_no" name="mobile_no" value={formData.mobile_no} onChange={handleChange} required />
              {errors.mobile_no && <span className="error-message">{errors.mobile_no}</span>}
            </div>
            <div className={`form-group ${errors.email ? 'error' : ''}`}>
              <label htmlFor="email">Email: <span className="required-asterisk">*</span></label>
              <input type="email" className='inptnv' id="email" name="email" value={formData.email} onChange={handleChange} required />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>
        </div>
 
        {/* Address Information */}
        <div className="address_divs">
          <div className="address-section present-address">
            <h2>Present Address</h2>
            <div className="address-group">
              <div className="form-row">
                <div className={`form-group ${errors.present_streetadd ? 'error' : ''}`}>
                  <label htmlFor="present_streetadd">Street Address: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv addressip' id="present_streetadd" name="present_streetadd" value={formData.present_streetadd} onChange={handleChange} />
                  {errors.present_streetadd && <span className="error-message">{errors.present_streetadd}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group ${errors.present_addressline2 ? 'error' : ''}`}>
                  <label htmlFor="present_addressline2">Address Line 2: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv addressip' id="present_addressline2" name="present_addressline2" value={formData.present_addressline2} onChange={handleChange} />
                  {errors.present_addressline2 && <span className="error-message">{errors.present_addressline2}</span>}
                </div>
              </div>
              <div className='city_state'>
                <div className={`form-group ${errors.present_city ? 'error' : ''}`}>
                  <label htmlFor="present_city">City: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv addressip' id="present_city" name="present_city" value={formData.present_city} onChange={handleChange} />
                  {errors.present_city && <span className="error-message">{errors.present_city}</span>}
                </div>
                <div className={`form-group ${errors.present_state ? 'error' : ''}`}>
                  <label htmlFor="present_state">State/Provision/Region: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv addressip' id="present_state" name="present_state" value={formData.present_state} onChange={handleChange} />
                  {errors.present_state && <span className="error-message">{errors.present_state}</span>}
                </div>
              </div>
              <div className='city_state'>
                <div className={`form-group ${errors.present_zipcode ? 'error' : ''}`}>
                  <label htmlFor="present_zipcode">ZIP / Postal Code: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv addressip' id="present_zipcode" name="present_zipcode" value={formData.present_zipcode} onChange={handleChange} />
                  {errors.present_zipcode && <span className="error-message">{errors.present_zipcode}</span>}
                </div>
                <div className={`form-group ${errors.present_country ? 'error' : ''}`}>
                  <label htmlFor="present_country">Country: <span className="required-asterisk">*</span></label>
                  <select id="present_country"  className='inptnv addressip' name="present_country" value={formData.present_country} onChange={handleChange}>
                    {errors.present_country && <span className="error-message">{errors.present_country}</span>}
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
 
          <div className="address-section permanent-address">
            <h2>Permanent Address</h2>
            <div className="address-group">
              <div className="form-row">
                <div className={`form-group ${errors.permanent_streetadd ? 'error' : ''}`}>
                  <label htmlFor="permanent_streetadd">Street Address: <span className="required-asterisk">*</span></label>
                  <input type="text"  className='inptnv addressip' id="permanent_streetadd" name="permanent_streetadd" value={formData.permanent_streetadd} onChange={handleChange} />
                  {errors.permanent_streetadd && <span className="error-message">{errors.permanent_streetadd}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group ${errors.permanent_addressline2 ? 'error' : ''}`}>
                  <label htmlFor="permanent_addressline2">Address Line 2: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv addressip' id="permanent_addressline2" name="permanent_addressline2" value={formData.permanent_addressline2} onChange={handleChange} />
                  {errors.permanent_addressline2 && <span className="error-message">{errors.permanent_addressline2}</span>}
                </div>
              </div>
              <div className="city_state">
                <div className={`form-group ${errors.permanent_city ? 'error' : ''}`}>
                  <label htmlFor="permanent_city">City: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv addressip' id="permanent_city" name="permanent_city" value={formData.permanent_city} onChange={handleChange} />
                  {errors.permanent_city && <span className="error-message">{errors.permanent_city}</span>}
                </div>
                <div className={`form-group ${errors.permanent_state ? 'error' : ''}`}>
                  <label htmlFor="permanent_state">State/Provision/Region: <span className="required-asterisk">*</span></label>
                  <input type="text"  className='inptnv addressip' id="permanent_state" name="permanent_state" value={formData.permanent_state} onChange={handleChange} />
                  {errors.permanent_state && <span className="error-message">{errors.permanent_state}</span>}
                </div>
              </div>
              <div className="city_state">
                <div className={`form-group ${errors.permanent_zipcode ? 'error' : ''}`}>
                  <label htmlFor="permanent_zipcode">ZIP / Postal Code: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv addressip' id="permanent_zipcode" name="permanent_zipcode" value={formData.permanent_zipcode} onChange={handleChange} />
                  {errors.permanent_zipcode && <span className="error-message">{errors.permanent_zipcode}</span>}
                </div>
                <div className={`form-group ${errors.permanent_country ? 'error' : ''}`}>
                  <label htmlFor="permanent_country">Country: <span className="required-asterisk">*</span></label>
                  <select id="permanent_country" className='inptnv addressip' name="permanent_country" value={formData.permanent_country} onChange={handleChange}>
                    {errors.permanent_country && <span className="error-message">{errors.permanent_country}</span>}
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Educational Information */}
        <div className="form-section educational-info">
          <h2>Academic Details</h2>
          <div className="form-row">
            <div className={`form-group ${errors.tenth_percentage ? 'error' : ''}`}>
              <label htmlFor="tenth_percentage">10th class Percentage: <span className="required-asterisk">*</span></label>
              <input type="number" className='inptnv' id="tenth_percentage" name="tenth_percentage" value={formData.tenth_percentage} onChange={handleChange} />
              {errors.tenth_percentage && <span className="error-message">{errors.tenth_percentage}</span>}
            </div>
            <div className={`form-group ${errors.twelfth_percentage ? 'error' : ''}`}>
              <label htmlFor="twelfth_percentage">12th class Percentage: <span className="required-asterisk">*</span></label>
              <input type="number" className='inptnv' id="twelfth_percentage" name="twelfth_percentage" value={formData.twelfth_percentage} onChange={handleChange} />
              {errors.twelfth_percentage && <span className="error-message">{errors.twelfth_percentage}</span>}
            </div>
            <div className={`form-group ${errors.btech_percentage ? 'error' : ''}`}>
              <label htmlFor="btech_percentage">11th Percentage: <span className="required-asterisk">*</span></label>
              <input type="number" className='inptnv' id="btech_percentage" name="btech_percentage" value={formData.btech_percentage} onChange={handleChange} />
              {errors.btech_percentage && <span className="error-message">{errors.btech_percentage}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group ${errors.university_roll_no ? 'error' : ''}`}>
              <label htmlFor="university_roll_no">University Roll No: <span className="required-asterisk">*</span></label>
              <input type="text" className='inptnv' id="university_roll_no" name="university_roll_no" value={formData.university_roll_no} onChange={handleChange} />
              {errors.university_roll_no && <span className="error-message">{errors.university_roll_no}</span>}
            </div>
            <div className={`form-group ${errors.branch ? 'error' : ''}`}>
              <label htmlFor="branch">Course: <span className="required-asterisk">*</span></label>
              <select id="branch" name="branch" value={formData.branch} onChange={handleChange}>
                {branches.map(branch => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </select>
              {errors.branch && <span className="error-message">{errors.branch}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group ${errors.college_city ? 'error' : ''}`}>
              <label htmlFor="college_city">College City: <span className="required-asterisk">*</span></label>
              <input type="text" className='inptnv' id="college_city" name="college_city" value={formData.college_city} onChange={handleChange} />
              {errors.college_city && <span className="error-message">{errors.college_city}</span>}
            </div>
            <div className={`form-group ${errors.college_state ? 'error' : ''}`}>
              <label htmlFor="college_state">College State:<span className="required-asterisk">*</span></label>
              <input type="text" className='inptnv' id="college_state" name="college_state" value={formData.college_state} onChange={handleChange} />
              {errors.college_state && <span className="error-message">{errors.college_state}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group ${errors.college_name ? 'error' : ''}`}>
              <label htmlFor="college_name">College Name: <span className="required-asterisk">*</span></label>
              <input type="text" className='inptnv' id="college_name" name="college_name" value={formData.college_name} onChange={handleChange} />
              {errors.college_name && <span className="error-message">{errors.college_name}</span>}
            </div>
          </div>
        </div>
 
        {/* File Uploads */}
        <div className="form-section file-uploads">
          <h2>Upload Certificates</h2>
          <div className="form-row">
            <div className={`form-group ${errors.tenth_certificate ? 'error' : ''}`}>
              <label htmlFor="tenth_certificate">10th Class (Only PDF): <span className="required-asterisk">*</span></label>
              <input type="file" className='inptnv' id="tenth_certificate" name="tenth_certificate" accept=".pdf" onChange={handleChange} />
              {errors.tenth_certificate && <span className="error-message">{errors.tenth_certificate}</span>}
            </div>
            <div className={`form-group ${errors.twelfth_certificate ? 'error' : ''}`}>
              <label htmlFor="twelfth_certificate">12th Class (Only PDF): <span className="required-asterisk">*</span></label>
              <input type="file" className='inptnv' id="twelfth_certificate" name="twelfth_certificate" accept=".pdf" onChange={handleChange} />
              {errors.twelfth_certificate && <span className="error-message">{errors.twelfth_certificate}</span>}
            </div>
            <div className={`form-group ${errors.btech_certificate ? 'error' : ''}`}>
              <label htmlFor="btech_certificate">Upload Aadhar card (Only PDF): <span className="required-asterisk">*</span></label>
              <input type="file" className='inptnv' id="btech_certificate" name="btech_certificate" accept=".pdf" onChange={handleChange} />
              {errors.btech_certificate && <span className="error-message">{errors.btech_certificate}</span>}
            </div>
            <div className={`form-group ${errors.profile_photo ? 'error' : ''}`}>
              <label htmlFor="btech_certificate">Profile Photo (Only PNG,JPG,JPEG): <span className="required-asterisk">*</span></label>
              <input type="file" className='inptnv' id="profile_photo" name="profile_photo" accept=".png,.jpg,.jpeg" onChange={handleChange} />
              {errors.profile_photo && <span className="error-message">{errors.profile_photo}</span>}
            </div>
          </div>
        </div>
 
        {/* Coaching Information */}
        <div className="form-section coaching-info">
          <div className="form-row">
            <div className={`form-group ${errors.coaching ? 'error' : ''}`}>
              <label htmlFor="coaching"> Are you previous took coaching?<span className="required-asterisk">*</span></label>
              <select  name="coaching" value={formData.coaching} onChange={handleChange}>
                <option value="" disabled>Select an option</option>
                {/* <option value="yes">Yes, I have taken coaching</option>
                <option value="no">No, I have not taken coaching</option> */}
                {coachingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* {errors.coaching && <span className="error-message">{errors.coaching}</span>} */}
            </div>
          </div>
          {formData.coaching === 'yes' && (
            <div className="coaching-details">
              <h2>ADDITIONAL INFORMATION</h2>
              <div className="form-row">
                <div className={`form-group ${errors.batch ? 'error' : ''}`} >
                  <label htmlFor="batch">Coaching Center Name <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv'  name="batch" value={formData.batch} onChange={handleChange} />
                  {/* {errors.batch && <span className="error-message">{errors.batch}</span>} */}
                </div>
                <div className={`form-group ${errors.rollno ? 'error' : ''}`}>
                  <label htmlFor="rollno">Roll No: <span className="required-asterisk">*</span></label>
                  <input type="text" className='inptnv'  name="rollno" value={formData.rollno} onChange={handleChange} />
                  {/* {errors.rollno && <span className="error-message">{errors.rollno}</span>} */}
                </div>
                <div className={`form-group ${errors.centername ? 'error' : ''}`}>
                  <label htmlFor="centername">Center Location: <span className="required-asterisk">*</span></label>
                  <select  name="centername" value={formData.centername} onChange={handleChange}>
                    <option value="">Select Center Location</option>
                    <option value="hyd">Hyderabad</option>
                    <option value="vijayawada">Bangalore</option>
                    <option value="other">other</option>
                  </select>
                  {/* {errors.centername && <span className="error-message">{errors.centername}</span>} */}
                </div>
              </div>
            </div>
          )}
         
        </div>
        <div className='buttonform'>
        <button type="submit" className ="pnrcf">Pay</button>
        {/* <button type="button" onClick={handleUserData}>User Data</button> */}
        </div>
 
      </form>
      {isEmailExistModalOpen && (
                <div className="modal-overlay">
               
                    <div className="modal-content">
                        <h2>Email Already Exists</h2>
                        <p>This email is already registered. Please log in.</p>
                        <button onClick={() => {
                            setEmailExistenceModalOpen(false);
                            setLoginVisible(true);
                        }} className='lgnemailexist'>Login</button>
                        <button className='closebuttonlogin' onClick={() => setEmailExistenceModalOpen(false)}><RxCross2 /></button>
                    </div>
                </div>
            )}

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
  );
};
 
export default PayRegisterForm;
