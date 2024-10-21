import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarUD from './NavbarUD';
import { useParams, useNavigate } from 'react-router-dom';
import './Userdashboard.css';
import videoimg from './Images/vid.png';
import { RxCross2 } from "react-icons/rx";
import { FaAngleDown } from "react-icons/fa";
import { CgShapeRhombus } from "react-icons/cg";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import styles


const MyCourses = () => {
    const { id, courseId } = useParams(); // Capture courseId from URL
    const navigate = useNavigate();
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpencourse, setModalIsOpencourse] = useState(false);
    const [modalcoursedropdown, setModalcoursedropdown] = useState(false);
    const [videoCounts, setVideoCounts] = useState({});

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('authToken');
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
                localStorage.setItem('selectedCourse', JSON.stringify(response.data));
            } catch (err) {
                console.error('Error fetching my courses:', err);
                setError('Failed to fetch my courses.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, [id]);

    // Fetch course details if courseId is present in the URL
    useEffect(() => {
        if (courseId) {
            const fetchCourseDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/course/my_courses/course_details/${id}/${courseId}`);
                    setSelectedCourse(response.data);
                    setModalIsOpencourse(true);
                } catch (err) {
                    console.error('Error fetching course details:', err);
                    setError('Failed to fetch course details.');
                }
            };
            fetchCourseDetails();
        }
    }, [id, courseId]);

    const handleViewCourse = (courseId) => {
        navigate(`/mycourses/${id}/${courseId}`); // Update URL
    };

    const closeCourse = () => {
        setSelectedCourse(null);
        setModalIsOpencourse(false);
    };

    const openVideoModal = async (videoLink, courseId, videoId) => {
        try {
            const response = await axios.get(`http://localhost:8000/course/video/count/${id}/${videoId}`);
            const videoCounts = response.data.video_count || 0;

            if (videoCounts >= 5) {
                alert("You can't play this video as you have reached the view limit.");
                return;
            }

            const topic = selectedCourse?.subjects
            .flatMap(subject => subject.topics)
            .find(topic => topic.videos.some(video => video.video_id === videoId));

         
            const courseCreationId = selectedCourse?.course_creation_id;
            const topicId = topic?.topic_id || null;

            if (!id || !courseCreationId || topicId === null || !videoId) {
                alert('All fields are required to update video count.');
                return;
            }

            await axios.post('http://localhost:8000/course/video/update_count', {
                userId: id,
                courseCreationId: courseCreationId,
                topicId: topicId,
                videoId: videoId
            });
            setVideoCounts(prev => ({ ...prev, [videoId]: (prev[videoId] || 0) + 1 }));
        } catch (err) {
            console.error('Error updating video count:', err.response?.data || err);
            alert('Failed to update video count.');
            return;
        }

        let embedUrl = videoLink;
        if (videoLink.includes('youtube.com/watch?v=')) {
            const vidId = new URL(videoLink).searchParams.get('v');
            embedUrl = `https://www.youtube.com/embed/${vidId}`;
        } else if (videoLink.includes('youtu.be/')) {
            const vidId = videoLink.split('/').pop();
            embedUrl = `https://www.youtube.com/embed/${vidId}`;
        }

        setSelectedVideo(embedUrl);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        window.location.reload();
        setSelectedVideo('');
    };

    const opentopicdropdown = () => {
        setModalcoursedropdown(!modalcoursedropdown);
    };

    return (
        <div>
            <NavbarUD userId={id} />
            <div className=' mycourses'>
                <h1 className='buych1'>My Courses</h1>
                {loading ? (
                    <p>Loading your courses...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="maincontainerviewcourse" id="viewcourse">
                        {modalIsOpencourse && selectedCourse ? (
                            <div className="course-details-modal" id={selectedCourse.course_creation_id}>
                                <div className='btnleft'>
                                    <button onClick={closeCourse} className='closebtncourse'>Close</button>
                                </div>
                                <div className='courseheadingtv'>
                                    <h2>{selectedCourse.courseName}</h2>
                                </div>
                                <div className='topic-dropdown'>
    <div>
        <div onClick={opentopicdropdown} className='labeldropdown'>
            Select a Topic <FaAngleDown className='fadown' />
        </div>
        {modalcoursedropdown && selectedCourse?.subjects?.length > 0 && (
            <div className='borderdropdown'>
                {selectedCourse.subjects.flatMap(subject => subject.topics).map((topic) => (
                    <div key={topic.topic_id}   className='dropdowndiv'>
                        <a href={`#${topic.topic_id}`} onClick={opentopicdropdown} className='dropdowndivanchor'>
                            {topic.topic_name}
                        </a>
                    </div>
                ))}
            </div>
        )}
    </div>
</div>

                                <div className='topics-videos-container'> 
                                {selectedCourse.subjects.map((subject) => (
    <div key={subject.subject_name}>    <h3>{subject.subject_name}</h3>
                                {subject.topics.map((topic) => {
    // Calculate the percentage of visited videos
    const visitedCount = topic.videos.filter(video => video.visit_count > 0).length;
    const totalCount = topic.videos.length;
    const visitPercentage = totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;

    return (
        <div key={topic.topic_id} id ={topic.topic_id}  className='topic-video'>
            <div className="h3vlcon">
                <h2 className='topicvideoh3 '>{topic.topic_name}
                <div className="progress-bar">
                <CircularProgressbar className="progress-bar-text"
                    value={visitPercentage}
                    text={`${Math.round(visitPercentage)}%`}
                    styles={buildStyles({
                        strokeLinecap: 'round',
                     
                        pathColor: `rgba(62, 152, 199, ${visitPercentage / 100})`,
                        textColor: '#f88',
                        trailColor: '#d6d6d6',
                    })}
                />
            </div></h2>
            </div>
           
            {topic.videos.length > 0 ? (
                <ul className='videotopicformycorsul'>
                {topic.videos.map((video) => {
                    const videoVisitCount = video.visit_count || 0;
                    const videoVisitPercentage = videoVisitCount > 0 ? (videoVisitCount / 5) * 100 : 0; // Assuming 5 is the max view count

                    return (
                        <li key={video.video_id} onClick={() => openVideoModal(video.video_link, selectedCourse.course_creation_id, video.video_id)} className='videotopicformycorsli'>
                            <div className="videoimgq">
                                <img src={videoimg} className="imgppvl" alt="Description of the video" />
                            </div>
                            <div className=" videoprogressbar vistcount video">
                                <CircularProgressbar className="progress-bar-textvl"
                                    value={videoVisitPercentage}
                                    text={`${Math.round(videoVisitPercentage)}%`}
                                    styles={buildStyles({
                                        strokeLinecap: 'round',
                                        pathColor: `rgba(62, 152, 199, ${videoVisitPercentage / 100})`,
                                        textColor: '#f88',
                                        trailColor: '#d6d6d6',
                                    })}
                                />
                            </div>
                            <span className="vistcount video">Visited: {videoVisitCount} / 5</span>
                            <p className='titlevidvl'>{video.video_name}</p>
                           
                        </li>
                    );
                })}
                </ul>
            ) : (
                <p className='novideopara'>
                    <div className='rhombusforvl'>
                        <CgShapeRhombus className='csvlr' />No videos available for this topic.<CgShapeRhombus className='cdr' />
                    </div>
                </p>
            )}
        </div>
    );
})}
</div>
 ))}
</div>


                            </div>
                        ) : (
                            myCourses.map((course) => (
                                <div className='exam-cards-containervl' key={course.course_creation_id}>
                                    <div className="exam-cardvl">
                                        <div className="imgsrc">
                                            {course.image ? (
                                                <img src={`data:image/jpeg;base64,${course.image}`} alt={course.course_name} />
                                            ) : (
                                                <p>No image available</p>
                                            )}
                                        </div>
                                        <div className="headec">
                                            <h5>{course.course_name}</h5>
                                        </div>
                                        <div className="fsvnsv subcardgrid valinosubvid">
                                            <div className='fsvnsv subhcard'>Validity: <div>{course.start_date} - {course.end_date}</div></div>
                                            <div>No of Videos:<div>{course.video_count}</div></div>
                                        </div>
                                        <div className='jsk'>
                                            <button onClick={() => handleViewCourse(course.course_creation_id)} className="btnbut">View Course</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            {modalIsOpen && selectedVideo && (
                <div className='modal-overlay'>
                    <div className="content_svideoplay">
                        <button onClick={closeModal} className="close-modalvlp"><RxCross2 /></button>
                        <iframe
                            width="560"
                            height="315"
                            src={selectedVideo}
                            title="Video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
               
    );
};

export default MyCourses;
