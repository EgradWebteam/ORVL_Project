import React,{useEffect,useState} from 'react'
import axios from 'axios';
import NavbarUD from './NavbarUD'
import logo123 from '../ug/Images/logo1.jpg';
import { useParams } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import './Userdashboard.css';

const MyCourses = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      const isAuthenticated = localStorage.getItem('authToken'); // Check your auth logic
      if (!isAuthenticated) {
        navigate('/olvug', { replace: true });
      }
    }, [navigate]);
    useEffect(() => {
      const fetchMyCourses = async () => {
          setLoading(true);
          try {
              const response = await axios.get(`http://localhost:8000/course/my_courses/${id}`);
              setMyCourses(response.data);
          } catch (err) {
              console.error('Error fetching my courses:', err);
              setError('Failed to fetch my courses.');
          } finally {
              setLoading(false);
          }
      };

      fetchMyCourses();
  }, [id]);

  const handleViewCourse = (courseId) => {
      navigate(`/viewCourse/${courseId}`);
  };
  return (
    <div>
  
    <NavbarUD userId={id}/>
    <div className='userInterfaceMainCon'>
                <h1 className='buych1'>My Courses</h1>
                {loading ? (
                    <p>Loading your courses...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="exam-cards-containervl">
                        {myCourses.map((course) => (
                            <div className="exam-cardvl" key={course.course_creation_id}>
                                <div className="imgsrc">
                                    {course.image ? (
                                        <img src={`data:image/jpeg;base64,${course.image}`} alt={course.course_name} />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                </div>
                                <div className="headec">
                                    <h5>{course.course_name}</h5> </div>
                                    <div className="fsvnsv subcardgrid valinosubvid">
                                    <div className='fsvnsv subhcard'>Validity: <div>{course.start_date} - {course.end_date}</div></div>
                                    <div>No of Videos:<div>{course.video_count}</div></div>
                                    </div>
                                    <div className='jsk'>
                                    <button onClick={() => handleViewCourse(course.course_creation_id)} className="btnbut">View Course</button>
                                    </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
   
  )
}

export default MyCourses