import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/videolect.css'

const VideoLectures = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Fetch all exams with images and subjects
    const fetchExams = async () => {
      try {
        // Fetch exams and their images
        const examResponse = await axios.get('http://localhost:8000/api/exams');
        const examData = examResponse.data;

        // For each exam, fetch its subjects
        const examsWithSubjects = await Promise.all(examData.map(async (exam) => {
          const subjectsResponse = await axios.get(`http://localhost:8000/api/exam/${exam.exam_id}/subjects`);
          return {
            ...exam,
            subjects: subjectsResponse.data,
          };
        }));

        setExams(examsWithSubjects);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="exam-cards-container">
      <div className="ribbon-border rbh1">VIDEO LECTURES</div>
      <div className='maincarddiv'>
        <div className='carddiv'></div>
      {exams.map((exam) => (
        <div key={exam.exam_id} className="cardsub subjectLecturesdiv">
            <h2>{exam.exam_name}</h2>
          <img src={`http://localhost:8000/uploads/${exam.image_url}`} alt={exam.exam_name} className="card-image" />
          <div className="card-content">
          
            <ul>
              {exam.subjects.map((subject) => (
                <h4 className="ribbon-border" key={subject.subject_id}>{subject.subject_name}</h4>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
    </div>
   
  );
};

export default VideoLectures;
