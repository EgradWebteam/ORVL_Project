import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css'

const MainForm = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
 
 gfhfgh
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
    }
  }, [selectedExam]);
 
  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSelectedSubjects([]); // Clear selected subjects when exam changes
  };
 
  const handleSubjectChange = (event) => {
    const { value, checked } = event.target;
    console.log(value,checked,"???????")
 
    setSelectedSubjects(prevState =>
      checked ? [...prevState, value] : prevState.filter(subject => subject !== value)
    );
    console.log(selectedSubjects,"////////////")
  };
 
 
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      exam_id: selectedExam,
      selectedsubjects: selectedSubjects
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
                //   checked={selectedSubjects.includes(subject.subject_id)}
                  onChange={handleSubjectChange}
                   className="checkbox-input"
                />
                <label htmlFor={`subject-${subject.subject_id}`}>{subject.subject_name}</label>
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
 