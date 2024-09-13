import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css';

const Topics = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
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
      setSelectedSubjects([]);
      setTopics([]); // Clear topics when exam changes
    }
  }, [selectedExam]);

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleSubjectChange = (event) => {
    const { value, checked } = event.target;

    setSelectedSubjects(prevState =>
      checked ? [...prevState, value] : prevState.filter(subject => subject !== value)
    );

    if (checked) {
      // Initialize topics for the selected subject
      setTopics(prevTopics => [
        ...prevTopics.filter(topic => topic.subject_id !== value), // Remove existing topics for the same subject
        { subject_id: value, topic_name: '' }
      ]);
    } else {
      // Remove topics for the deselected subject
      setTopics(prevTopics => prevTopics.filter(topic => topic.subject_id !== value));
    }
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
    setTopics(prevTopics => [...prevTopics, { subject_id: '', topic_name: '' }]);
  };

  const handleRemoveTopic = (index) => {
    setTopics(prevTopics => prevTopics.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare data for submission
    const examData = {
      exam_id: selectedExam,
      selectedsubjects: selectedSubjects
    };

    const topicData = topics.map(topic => ({
      topic_name: topic.topic_name,
      subject_id: topic.subject_id
    }));

    // Post selection data and topic data
    axios.post('http://localhost:8000/api/submit-selection', examData)
      .then(() => axios.post('http://localhost:8000/api/submit-topics', { topics: topicData }))
      .then(() => alert('Selection and topics saved successfully'))
      .catch(error => console.error('Error saving selection or topics:', error));
  };

  return (
    <div className='examform'>
      <h1>Topic Selector</h1>
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
            <h3>Select Subjects:</h3>
            {subjects.map(subject => (
              <div key={subject.subject_id}>
                <input
                  type='checkbox'
                  id={`subject-${subject.subject_id}`}
                  value={subject.subject_id}
                //   checked={selectedSubjects.includes(subject.subject_id)}
                  onChange={handleSubjectChange}
                  className="checkbox-input"
                />
                <label htmlFor={`subject-${subject.subject_id}`}>{subject.subject_name}</label>
              </div>
            ))}
          </div>
        )}
        {topics.length > 0 && (
          <div>
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
  );
};

export default Topics;
