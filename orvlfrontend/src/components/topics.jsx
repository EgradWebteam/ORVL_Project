import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from './Images/image.png'
import Leftnavbar from '../components/Leftnavbar'

const Topics = () =>{
  const [exams, setExams] = useState([]); 
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(''); // Manage selected subject
  const [topics, setTopics] = useState([]);

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

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value); // Update selectedSubject
    // Initialize topics for the selected subject
    setTopics([{ subject_id: event.target.value, topic_name: '' }]);
  };

  const handleTopicChange = (index, event) => {
    const { value } = event.target;
    setTopics(prevTopics =>
      prevTopics.map((topic, i) =>
        i === index ? { ...topic, topic_name: value } : topic
      )
    );
  };

  const handleAddTopic = () => {
    setTopics(prevTopics => [...prevTopics, { subject_id: selectedSubject, topic_name: '' }]);
  };

  const handleRemoveTopic = (index) => {
    setTopics(prevTopics => prevTopics.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Prepare data for submission
    const examData = {
      exam_id: selectedExam,
      selectedsubjects: [selectedSubject] 
    };

    const topicData = topics.map(topic => ({
      exam_id: selectedExam,  
      subject_id: topic.subject_id,
      topic_name: topic.topic_name
    }));

    axios.post('http://localhost:8000/api/submit-selection', examData)
      .then(() => axios.post('http://localhost:8000/api/add-video', { topics: topicData }))
      .then(() => alert('Selection and topics saved successfully'))
      .catch(error => console.error('Error saving selection or topics:', error));
  };

  return (
    <div>
    <div className='headerjeem'>
    <div className='headerjee'>
<img src = {Logo_img} />

</div>
    <a className='jeeanchor' href='/Home'>
    <IoMdHome /> Home
    </a>
</div>
{<Leftnavbar/>}
    <div className='examform longform'>
      <h1>Topics Creaction</h1>
      <form onSubmit={handleSubmit}>
        <div className='div1'>
          <label htmlFor="exam">Select Exam:</label>
          <select id="exam" className='dropdown' value={selectedExam} onChange={handleExamChange}>
            <option value="">--Select an exam--</option>
            {exams.map(exam => (
              <option key={exam.exam_id} value={exam.exam_id}>{exam.exam_name}</option>
            ))}
          </select>
        </div>
        {subjects.length > 0 && (
          <div className='div1'>
         
            <label htmlFor="subject-dropdown">Select Subject:</label>
            <select 
              id="subject-dropdown"
              value={selectedSubject} // Manage selectedSubject state
              onChange={handleSubjectChange} 
              className="dropdown"
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
          <div className='div1'>
            <h3>Enter Topics:</h3>
            {topics.map((topic, index) => (
              <div key={index} className="topic-entry">
                <input
                  type="text"
                  value={topic.topic_name}
                  onChange={(event) => handleTopicChange(index, event)}
                  placeholder="Enter topic name"
                />
                <button type="button" onClick={handleAddTopic}>+</button>
                <button type="button" onClick={() => handleRemoveTopic(index)}>-</button>
              </div>
            ))}
          </div>
        )}
        <button type="submit">Submit Selection</button>
      
      </form>
    </div>
    </div>
  );
};

export default Topics;
