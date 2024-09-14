
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './videolect.css';
const VideoLectures = () => {
    
    
 
      const [exams, setExams] = useState([]);
      const [subjectsByExam, setSubjectsByExam] = useState({});
    
      // Fetch exams on component mount
      useEffect(() => {
        axios.get('http://localhost:8001/api/exams')
          .then(response => {
            const examsData = response.data;
            setExams(examsData);
            
            // Fetch subjects for each exam
            const subjectRequests = examsData.map(exam =>
              axios.get(`http://localhost:8001/api/exam/${exam.exam_id}/subjects`)
                .then(response => ({ examId: exam.exam_id, subjects: response.data }))
            );
    
            // Once all subject requests are completed, update state
            Promise.all(subjectRequests)
              .then(results => {
                const subjectsMap = {};
                results.forEach(result => {
                  subjectsMap[result.examId] = result.subjects;
                });
                setSubjectsByExam(subjectsMap);
              })
              .catch(error => console.error('Error fetching subjects:', error));
          })
          .catch(error => console.error('Error fetching exams:', error));
      }, []);
    
      return (
        <div>
            <div className="ribbon-border rbh1 ">VIDEO LECTURES</div>
           
        
           
            <div className='maincarddiv'>
            <div className='carddiv '>
              {exams.map(exam => (
                <div key={exam.exam_id}  className="vlsubjectcardsub cardsub">
                  <h2>{exam.exam_name}</h2>
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
 
    

export default VideoLectures