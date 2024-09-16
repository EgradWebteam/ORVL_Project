import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from './Images/image.png';
import Leftnavbar from '../components/Leftnavbar';
import { RxCross2 } from "react-icons/rx";

const MainForm = () => {
  const [modal1, setModal1] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selections, setSelections] = useState([]);

  // Toggle the modal visibility
  const toggleModal1 = () => {
    setModal1(!modal1);
  };

  // Fetch exams when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8000/api/exams')
      .then(response => {
        setExams(response.data);
      })
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  // Fetch subjects when an exam is selected
  useEffect(() => {
    if (selectedExam) {
      axios.get(`http://localhost:8000/api/exam/${selectedExam}/subjects`)
        .then(response => {
          setSubjects(response.data);
        })
        .catch(error => console.error('Error fetching subjects:', error));
    } else {
      setSubjects([]);
    }
  }, [selectedExam]);

  // Fetch initial selections to display in the table
  useEffect(() => {
    axios.get('http://localhost:8000/api/selections')
      .then(response => {
        setSelections(response.data);
      })
      .catch(error => console.error('Error fetching selections:', error));
  }, []);

  // Handle exam change
  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSelectedSubjects([]); // Clear selected subjects when exam changes
  };

  // Handle subject change
  const handleSubjectChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSubjects(prevState =>
      checked ? [...prevState, value] : prevState.filter(subject => subject !== value)
    );
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      exam_id: selectedExam,
      selectedsubjects: selectedSubjects
    };

    axios.post('http://localhost:8000/api/submit-selection', data)
      .then(() => {
        alert('Selection saved successfully');
        // Fetch updated selections
        return axios.get('http://localhost:8000/api/selections');
      })
      .then(response => {
        setSelections(response.data);
        // Optionally close modal and reset form
        setModal1(false);
        setSelectedExam('');
        setSelectedSubjects([]);
        setSubjects([]);
      })
      .catch(error => console.error('Error saving selection:', error));
  };

  return (
    <div>
      <div className='headerjeem'>
        <div className='headerjee'>
          <img src={Logo_img} alt="Logo" />
        </div>
        <a className='jeeanchor' href='/Home'>
          <IoMdHome /> Home
        </a>
      </div>
      <Leftnavbar />

      <button className='btnes' onClick={toggleModal1}>Exam Selection</button>

      {modal1 && (
        <div className='examform'>
          <div className='modal'>
            <div className='overlay'></div>
            <div className='content_m'>
              <h1>Exam Selection</h1>
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
                    <label>Select Subjects:</label>
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
                        <label className="checkb" htmlFor={`subject-${subject.subject_id}`}>{subject.subject_name}</label>
                      </div>
                    ))}
                  </div>
                )}
                <button type="submit">Submit Selection</button>
              </form>
              <button className='closebutton' onClick={toggleModal1}><RxCross2 /></button>
            </div>
          </div>
        </div>
      )}

      <div className='selections-tablecontainer'>
        <h2>Selection Table</h2>
        <table className='selections-table'>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Exam Name</th>
              <th>Subject Name</th>
            </tr>
          </thead>
          <tbody>
            {selections.map((selection,index) => (
              <tr key={selection.selection_id}>
                <td>{index+1}</td>
                <td>{selection.exam_name}</td>
                <td>{selection.subject_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainForm;
