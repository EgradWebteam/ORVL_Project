import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css'

const MainForm = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [topics, setTopics] = useState({});
 // Use an object to map subject IDs to topics

  useEffect(() => {
    axios.get('http://localhost:8000/api/exams')
      .then(response => {
        console.log('Fetched exams:', response.data);
        setExams(response.data);
      })
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  useEffect(() => {
    if (selectedExam) {
      axios.get(`http://localhost:8000/api/exam/${selectedExam}/subjects`)
        .then(response => {
          console.log('Fetched subjects:', response.data);
          setSubjects(response.data);
        })
        .catch(error => console.error('Error fetching subjects:', error));
    } else {
      setSubjects([]);
    }
  }, [selectedExam]);

  useEffect(() => {
    if (selectedSubjects.length > 0) {
      selectedSubjects.forEach(subjectId => {
        axios.get(`http://localhost:8000/api/exam/${selectedExam}/subjects/${subjectId}/topics`)
          .then(response => {
            console.log(`Fetched topics for subject ${subjectId}:`, response.data);
            setTopics(prevTopics => ({
              ...prevTopics,
              [subjectId]: response.data
            }));
          })
          .catch(error => console.error(`Error fetching topics for subject ${subjectId}`, error));
      });
    }
  }, [selectedSubjects]);

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSelectedSubjects([]);
    setTopics({});
  };

  const handleSubjectChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSubjects(prevState =>
      checked ? [...prevState, value] : prevState.filter(subject => subject !== value)
    );
    if (!checked) {
      setTopics(prevTopics => {
        const updatedTopics = { ...prevTopics };
        delete updatedTopics[value];
        return updatedTopics;
      });
    }
  };

  const handleAddTopic = (subjectId) => {
    setTopics(prevTopics => ({
      ...prevTopics,
      [subjectId]: [...(prevTopics[subjectId] || []), '']
    }));
  };

  const handleRemoveTopic = (subjectId, index) => {
    setTopics(prevTopics => ({
      ...prevTopics,
      [subjectId]: prevTopics[subjectId].filter((_, i) => i !== index)
    }));
  };

  const handleTopicChange = (subjectId, index, value) => {
    setTopics(prevTopics => ({
      ...prevTopics,
      [subjectId]: prevTopics[subjectId].map((topic, i) => (i === index ? value : topic))
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      exam_id: selectedExam,
      selectedsubjects: selectedSubjects,
      topics: topics
    };

    axios.post('http://localhost:8000/api/submit-selection', data)
      .then(response => alert('Selection saved successfully'))
      .catch(error => console.error('Error saving selection:', error));
  };

  return (
    <div className='examform'>
      <h1>Exam Selector</h1>
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
                  // checked={selectedSubjects.includes(subject.subject_id)}
                  onChange={handleSubjectChange}
                  className="checkbox-input"
                />
                <label htmlFor={`subject-${subject.subject_id}`}>{subject.subject_name}</label>
              </div>
            ))}
          </div>
        )}
        {selectedSubjects.map(subjectId => (
          <div key={subjectId}>
            <h4>Topics for Subject {subjectId}</h4>
            {(topics[subjectId] || []).map((topic, index) => (
              <div key={index} className="topic-input">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => handleTopicChange(subjectId, index, e.target.value)}
                />
                <button type="button" onClick={() => handleRemoveTopic(subjectId, index)}>-</button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddTopic(subjectId)}>+</button>
          </div>
        ))}
        <button type="submit">Submit Selection</button>
      </form>
    </div>
  );
};

export default MainForm;
