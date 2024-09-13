import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
const MainForm = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
 
  useEffect(() => {
 
    axios.get('http://localhost:5000/api/exams')
      .then(response => setExams(response.data))
      .catch(error => console.error('Error fetching exams:', error));
  }, []);
 
  useEffect(() => {
 
    if (selectedExam) {
      axios.get(`http://localhost:5000/api/exam/${selectedExam}/subjects`)
        .then(response => setSubjects(response.data))
        .catch(error => console.error('Error fetching subjects:', error));
    }
  }, [selectedExam]);
 
  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSelectedSubjects([]); 
  };
 
  const handleSubjectChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSubjects(prevState =>
      checked ? [...prevState, value] : prevState.filter(subject => subject !== value)
    );
  };
 
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      exam_id: selectedExam,
      selectedsubjects: selectedSubjects
    };
 
    axios.post('http://localhost:5000/api/submit-selection', data)
      .then(response => alert('Selection saved successfully'))
      .catch(error => console.error('Error saving selection:', error));
  };
 
  return (
    <div>
      <h1>Exam Selector</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="exam">Select Exam:</label>
          <select id="exam" value={selectedExam} onChange={handleExamChange}>
            <option value="">--Select an exam--</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.name}</option>
            ))}
          </select>
        </div>
        {subjects.length > 0 && (
          <div>
            <h3>Select Subjects:</h3>
            {subjects.map(subject => (
              <div key={subject.id}>
                <input
                  type="checkbox"
                  id={`subject-${subject.id}`}
                  value={subject.id}
                  checked={selectedSubjects.includes(subject.id)}
                  onChange={handleSubjectChange}
                />
                <label htmlFor={`subject-${subject.id}`}>{subject.name}</label>
              </div>
            ))}
          </div>
        )}
        <button type="submit">Submit Selection</button>
      </form>
    </div>
  );
};
 
export default MainForm;