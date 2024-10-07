import React, { useState, useEffect } from 'react';
import NavbarUD from './NavbarUD';
import logo123 from '../ug/Images/logo1.jpg';
import { useParams } from 'react-router-dom';
import course from '../ug/Images/course123.jpg';
import { IoMdHome } from "react-icons/io";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
    const navigate = useNavigate();
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('authToken'); // Check your auth logic
        if (!isAuthenticated) {
          navigate('/olvug', { replace: true });
        }
      }, [navigate]);

      useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get(`http://localhost:8000/course/courses_main`);
                setCourses(response.data); // Adjust this based on the structure of your response
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to fetch courses.');
            } finally {
                setLoading(false); // Stop loading
            }
        };
    
        fetchCourses();
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
    const handleBuyCourse = async (courseId, paymentResponse) => {
        try {
            const purchaseResponse = await axios.post('http://localhost:8000/course/buy_course', {
                userId: id,
                courseCreationId: courseId,
                paymentId: paymentResponse.razorpay_payment_id, // Send payment ID to your server
                status: 'paid', // You may want to include this in your backend logic
            });
            alert(purchaseResponse.data.message);
          
        } catch (error) {
            console.error('Error during purchase:', error);
            alert('Failed to purchase course.');
        }
    };
    const handleOpenModal = (course) => {
        setSelectedCourse(course);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setUserInfo({ name: '', email: '', phone: '' }); // Reset user info
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await initiatePayment(selectedCourse.course_creation_id, userInfo);
        handleCloseModal();
    };
const initiatePayment = async (courseId) => {
    try {
        const course = courses.find(c => c.course_creation_id === courseId);
        
        if (!course) {
            throw new Error('Course not found');
        }

        const response = await axios.post('http://localhost:8000/course/create-order', {
            amount: course.total_price // Amount in smallest currency unit (e.g., paise)
        });

        const options = {
            key: 'rzp_test_x3lel82AZIsRl6', // Your Razorpay key ID
            amount: response.data.amount,
            currency: response.data.currency,
            name: 'Course Purchase',
            description: course.course_name,
            order_id: response.data.id,
            handler: async function (response) {
                // Payment successful
                await handleBuyCourse(courseId, response);
            },
            prefill: {
                name: 'Your Name', // Replace with user's name
                email: 'user@example.com', // Replace with user's email
                contact: '9999999999' // Replace with user's contact number
            },
            theme: {
                color: '#F37254' // Your theme color
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        // Return a success response
        return { success: true, response };
    } catch (error) {
        console.error('Error initiating payment:', error);
        return { success: false, error }; // Return error info
    }
};

    return (
        <div>
          
            <NavbarUD userId={id} />
            <div className='userInterfaceMainCon'>
            <h1 className='buych1'>Buy Courses</h1>
                {loading ? (
                    <p>Loading exams...</p> // Loading indicator
                ) : (
                    <div className="exam-cards-containervl">
                    
                        {courses.map((course) => (
                            <div className="exam-cardvl" key={course.course_creation_id}>
                                <div className="imgsrcimf">  {course.image ? (
                <img src={`data:image/jpeg;base64,${course.image}`} alt={course.course_name} className='imgppimf' />
            ) : (
                <p>No image available</p>
            )} </div>
                                <div className="headec"><h5>{course.course_name}</h5></div>
                                <div className="fsvnsv subcardgrid valinosubvid">
                                    <div className='fsvnsv subhcard'>Validity: <div>{formatDate (course.start_date)}-{formatDate (course.end_date)}</div></div>
                                    {/* <div className='fsvnsv subhcard'>No of subjects: <div>{course.subject_count}</div></div> */}
                                    <div className='fsvnsv'>No of Videos: <div>{course.video_count}</div></div>
                                </div>
                                <div className="comcardbuyprice">
                                    <div className='fsvnsv pricebuy'>${course.total_price}</div>
                                    <button className="btnbut" onClick={() =>  handleOpenModal(course)}>BUY NOW</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content mcposition">
                        <h2>Enter Your Details</h2>
                        <form onSubmit={handleFormSubmit} className='paymentformflex'>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Your Name" 
                                value={userInfo.name} 
                                onChange={handleInputChange}
                                className='inputfpem inputpayment' 
                                required 
                            />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Your Email" 
                                value={userInfo.email} 
                                onChange={handleInputChange}
                                className='inputfpem inputpayment' 
                                required 
                            />
                            <input 
                                type="tel" 
                                name="phone" 
                                placeholder="Your Phone Number" 
                                value={userInfo.phone} 
                                onChange={handleInputChange} 
                                className='inputfpem inputpayment'
                                required 
                            />
                            <div className='btnflex'>
                            <button type="submit" className='lgnemailexist'>Proceed to Payment</button>
                            <button type="button" onClick={handleCloseModal} className='lgnemailexist'>Cancel</button>
                            </div>
                        </form>
                        </div>
                </div>
            )}
        </div>
    );
}

export default BuyCourses;
