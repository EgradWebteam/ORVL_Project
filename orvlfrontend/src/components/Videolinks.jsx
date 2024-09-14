import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css';

const Videolinks = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    // Fetch exams when component mounts
    axios.get('http://localhost:8000/api/exams')
      .then(response => {
        console.log('Fetched exams:', response.data);
        setExams(response.data);
      })
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  useEffect(() => {
    // Fetch subjects when an exam is selected
    if (selectedExam) {
      axios.get(`http://localhost:8000/api/exam/${selectedExam}/subjects`)
        .then(response => {
          console.log('Fetched subjects:', response.data);
          setSubjects(response.data);
        })
        .catch(error => console.error('Error fetching subjects:', error));
    } else {
      setSubjects([]);
      setSelectedSubject(''); // Clear selected subject when exam changes
      setTopics([]); // Clear topics when exam changes
    }
  }, [selectedExam]);

  useEffect(() => {
    // Fetch topics when a subject is selected
    if (selectedSubject) {
      axios.get(`http://localhost:8000/api/subjects/${selectedSubject}/topics`)
        .then(response => {
          console.log('Fetched topics:', response.data);
          setTopics(response.data);
        })
        .catch(error => console.error('Error fetching topics:', error));
    } else {
      setTopics([]);
      setSelectedTopic(''); // Clear selected topic when subject changes
    }
  }, [selectedSubject]);

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value); // Update selectedSubject
    // Initialize topics for the selected subject
    setTopics([]); // Clear topics when subject changes
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value); // Update selectedTopic
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Prepare data for submission
    const examData = {
      exam_id: selectedExam,
      selectedsubjects: [selectedSubject] // Update to use selectedSubject
    };

    const topicData = topics.map(topic => ({
      exam_id: selectedExam,
      subject_id: topic.subject_id,
      topic_name: topic.topic_name
    }));

    // Post selection data and topic data
    axios.post('http://localhost:8000/api/submit-selection', examData)
      .then(() => axios.post('http://localhost:8000/api/submit-topics', { topics: topicData }))
      .then(() => alert('Selection and topics saved successfully'))
      .catch(error => console.error('Error saving selection or topics:', error));
  };

  return (
    <div className='examform'>
      <h1>Video Selector</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="exam">Select Exam:</label>
          <select id="exam" value={selectedExam} onChange={handleExamChange}>
            <option value="">--Select an exam--</option>
            {exams.map(exam => (
              <option key={exam.exam_id} value={exam.exam_id}>{exam.exam_name}</option>
            ))}
          </select>
        </div>
        {subjects.length > 0 && (
          <div>
            <h3>Select Subject:</h3>
            <select 
              id="subject-dropdown"
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="dropdown-select"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option 
                  key={subject.subject_id} 
                  value={subject.subject_id}
                >
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>
        )}
        {topics.length > 0 && (
          <div>
            <h3>Select Topics:</h3>
            <select 
              id="topic-dropdown"
              value={selectedTopic}
              onChange={handleTopicChange}
              className="dropdown-select"
            >
              <option value="">Select a topic</option>
              {topics.map(topic => (
                <option 
                  key={topic.topic_id} 
                  value={topic.topic_id}
                >
                  {topic.topic_name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit">Submit Selection</button>
      </form>
    </div>
  );
};

export default Videolinks;
