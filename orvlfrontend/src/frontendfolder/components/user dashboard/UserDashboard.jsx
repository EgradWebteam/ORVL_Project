import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarUD from './NavbarUD';
import { useParams, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Correct import
import './Userdashboard.css';

// Register the ArcElement, Tooltip, and Legend
ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
    const { id } = useParams();
    const [profileDataDisplay, setProfileDataDisplay] = useState({});
    const [viewedCourses, setViewedCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileDisplay = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/profile/profile/${id}`);
                setProfileDataDisplay(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        if (id) {
            fetchProfileDisplay();
        }
    }, [id]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) {
            return "Good Morning";
        } else if (hour >= 12 && hour < 15) {
            return "Good Afternoon";
        } else if (hour >= 15 && hour < 19) {
            return "Good Evening";
        } else {
            return "Good Night";
        }
    };

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('authToken');
        if (!isAuthenticated) {
            navigate('/olvug', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const fetchViewedCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/course/videovistedcount/${id}`);
                setViewedCourses(response.data);
            } catch (error) {
                console.error('Error fetching viewed courses:', error);
            }
        };

        if (id) {
            fetchViewedCourses();
        }
    }, [id]);

    const handleContinue = (courseId) => {
        navigate(`/mycourses/${id}/${courseId}`);
    };

    return (
        <div>
            <NavbarUD userId={id} />
            <div className='userInterfaceMainCon'>
                {profileDataDisplay && (
                    <div className='dashboardvl'>
                        <h1>{getGreeting()}, {profileDataDisplay.name}</h1>
                        <h2>Happy Learning!</h2>
                    </div>
                )}
                {viewedCourses.length > 0 && (
                    <div>
                        <h3>Viewed Courses:</h3>
                        <div className="courseContainerdashboard">
                        {viewedCourses.map(course => {
                            
                            const totalVideos = course.total_video_count || 0;
                            const viewedVideos = course.viewed_video_count || 0;
                            const percentageViewed = totalVideos > 0 ? (viewedVideos / totalVideos) * 100 : 0;

                            const data = {
                                labels: ['Completed', 'Remaining'],
                                datasets: [
                                    {
                                        data: [percentageViewed, 100 - percentageViewed],
                                        backgroundColor: ['#007bff', '#e9ecef'], // Blue and light grey
                                        borderColor: ['#007bff', '#e9ecef'],
                                        borderWidth: 1,
                                    },
                                ],
                            };
                             
                            return (
                              
                                <div key={course.course_creation_id} className="courseItem">
                                    <div>{course.course_name}</div>
                                    <Pie data={data} />
                                    <div>Viewed Videos: {viewedVideos} / {totalVideos}</div>
                                    <div>Percentage Viewed: {percentageViewed.toFixed(2)}%</div>
                                    <button onClick={() => handleContinue(course.course_creation_id)} className='btncontinue'>
                                        Continue
                                    </button>
                                </div>
                             
                            );
                           
                
                        })}
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
