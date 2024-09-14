import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './videolect.css';

const VideoLectures = () => {
  const [exams, setExams] = useState([]);
  const [subjectsByExam, setSubjectsByExam] = useState({});
  const [imagesByExam, setImagesByExam] = useState({});

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/exams');
        const examsData = response.data;
        setExams(examsData);

        // Fetch subjects for each exam
        const subjectRequests = examsData.map(exam =>
          axios.get(`http://localhost:8000/api/exam/${exam.exam_id}/subjects`)
            .then(response => ({ examId: exam.exam_id, subjects: response.data }))
        );

        // Fetch images for each exam
        const imageRequests = examsData.map(exam =>
          axios.get(`http://localhost:8000/api/exam/${exam.exam_id}/exam_images`) // Fixed URL
            .then(response => ({ examId: exam.exam_id, images: response.data }))
        );

        // Process subject and image requests
        const [subjectResults, imageResults] = await Promise.all([
          Promise.all(subjectRequests),
          Promise.all(imageRequests)
        ]);

        // Update state with subjects and images
        const subjectsMap = {};
        const imagesMap = {};

        subjectResults.forEach(result => {
          subjectsMap[result.examId] = result.subjects;
        });

        imageResults.forEach(result => {
          imagesMap[result.examId] = result.images;
        });

        setSubjectsByExam(subjectsMap);
        setImagesByExam(imagesMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchExams();
  }, []);

  return (
    <div>
      <div className="ribbon-border rbh1">VIDEO LECTURES</div>
      <div className='maincarddiv'>
        <div className='carddiv'>
          {exams.map(exam => (
            <div key={exam.exam_id} className="vlsubjectcardsub cardsub">
              <h2>{exam.exam_name}</h2>
              {imagesByExam[exam.exam_id] && (
                <div>
                  {imagesByExam[exam.exam_id].map(image => (
                    <div key={image.image_id}>
                      <h4 className="image">{image.image_name}</h4>
                      <img src={image.image_url} alt={image.image_name} className="image-thumbnail" /> {/* Display image */}
                    </div>
                  ))}
                </div>
              )}
              {subjectsByExam[exam.exam_id] && (
                <div>
                  {subjectsByExam[exam.exam_id].map(subject => (
                    <div key={subject.subject_id}>
                      <h4 className="ribbon-border">{subject.subject_name}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoLectures;
