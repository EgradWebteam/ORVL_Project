import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../Images/image.png';
import Leftnavbar from './Leftnavbar';
import { RxCross2 } from "react-icons/rx";
 
const ExamCreation = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selections, setSelections] = useState([]);
  const [editingSelection, setEditingSelection] = useState(null);
 
  // Fetch exams when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8000/ExamCreation/exams')
      .then(response => {
        setExams(response.data);
      })
      .catch(error => console.error('Error fetching exams:', error));
  }, []);
 
  useEffect(() => {
    if (selectedExam) {
        axios.get(`http://localhost:8000/ExamCreation/exam/${selectedExam}/subjects`)
            .then(response => {
                console.log('Fetched Subjects:', response.data); // Log the fetched subjects
                setSubjects(response.data);
            })
            .catch(error => console.error('Error fetching subjects:', error));
    } else {
        setSubjects([]);
    }
    console.log('Currently selected subjects:', selectedSubjects);
}, [selectedExam]);
useEffect(() => {
  console.log('Updated Selected Subjects:', selectedSubjects);
}, [selectedSubjects]);
 
  // Fetch initial selections
  useEffect(() => {
    axios.get('http://localhost:8000/ExamCreation/selections')
      .then(response => {
        setSelections(response.data);
      })
      .catch(error => console.error('Error fetching selections:', error));
  }, []);
  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSelectedSubjects([]); // Reset selected subjects when exam changes
};
 
const handleSubjectChange = (event) => {
  const { value, checked } = event.target;
  setSelectedSubjects((prevState) => {
    const newSelectedSubjects = checked
      ? [...prevState, value]
      : prevState.filter(subject => subject !== value);
    console.log('New Selected Subjects:', newSelectedSubjects);
    return newSelectedSubjects;
  });
};
 
 
useEffect(() => {
  console.log('Updated Selected Subjects:', selectedSubjects);
}, [selectedSubjects]); // This will log whenever selectedSubjects changes
 
 
const handleSubmit = (event) => {
  event.preventDefault();
 
  // Use the latest selectedSubjects from state
  console.log('Selected Subjects before submission:', selectedSubjects);
 
  const data = {
    exam_id: selectedExam,
    selectedsubjects: selectedSubjects,
  };
  console.log('Data to submit:', data); // Log data before sending
 
  const request = editingSelection
    ? axios.put(`http://localhost:8000/ExamCreation/selections/ExamCreation_update/${editingSelection}`, data)
    : axios.post('http://localhost:8000/ExamCreation/submit-selection', data);
 
  request
    .then(() => {
      alert(`${editingSelection ? 'Selection updated' : 'Selection saved'} successfully`);
      return axios.get('http://localhost:8000/ExamCreation/selections');
    })
    .then(response => {
      setSelections(response.data);
      resetForm(); // Reset only after successful submission
    })
    .catch(error => {
      console.error('Error saving selection:', error);
    });
};
const handleEdit = (index) => {
  const selectionToEdit = selections[index];
  if (selectionToEdit) {
    setEditingSelection(selectionToEdit.selection_id);
    setSelectedExam(selectionToEdit.exam_id);
 
    const selectionSubjects = selectionToEdit.subject_ids.split(',').map(id => id.trim());
    setSelectedSubjects(selectionSubjects);
    setModalOpen(true);
  }
};
 
 
const handleDelete = (exam_id) => {
  if (window.confirm('Are you sure you want to delete this selection?')) {
      axios.delete(`http://localhost:8000/ExamCreation/selections/ExamCreation_delete/${exam_id}`)
          .then(response => {
              console.log('Delete response:', response);
              alert('Selection deleted successfully');
              return axios.get('http://localhost:8000/ExamCreation/selections');
          })
          .then(response => {
              setSelections(response.data);
          })
          .catch(error => {
              console.error('Error deleting selection:', error.message || error);
              alert('Failed to delete selection. Please try again.');
          });
  }
};
 
const resetForm = () => {
  setModalOpen(false);
  setSelectedExam('');
  setEditingSelection(null);
  setSubjects([]);
  // Consider whether to reset selectedSubjects based on the context
  // setSelectedSubjects([]); // Avoid resetting here if not needed
  console.log('Form reset: selectedSubjects:', selectedSubjects);
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
      <div className='headerpageh1'>
        <h1> Exam Selection Page</h1>
      </div>
      <button className='btnes' onClick={() => setModalOpen(true)}>Exam Selection</button>
 
      {modalOpen && (
        <div className='examform'>
          <div className='modal'>
            <div className='content_s'>
              <h1>{editingSelection !== null ? 'Edit Selection' : 'Exam Selection'}</h1>
              <form onSubmit={handleSubmit}>
                <div className='div1'>
                  <label htmlFor="exam">Select Exam:</label>
                  <select id="examcreation" className='dropdown' value={selectedExam} onChange={handleExamChange}>
                    <option value="">--Select an exam--</option>
                    {exams.map(exam => (
                      <option key={exam.exam_id} value={exam.exam_id}>{exam.exam_name}</option>
                    ))}
                  </select>
                </div>
                {subjects.length > 0 && (
    <div className='div1'>
        <label>Select Subjects:</label>
        {subjects.map(subject => {
  const isChecked = selectedSubjects.includes(subject.subject_id.toString());
  return (
    <div key={subject.subject_id}>
      <input
        type='checkbox'
        id={`subject-${subject.subject_id}`}
        value={subject.subject_id}
        checked={isChecked} // Controlled checkbox
        onChange={handleSubjectChange}
      />
      <label htmlFor={`subject-${subject.subject_id}`}>{subject.subject_name}</label>
    </div>
  );
})}
 
    </div>
)}
                <button type="submit">{editingSelection !== null ? 'Update Selection' : 'Submit Selection'}</button>
              </form>
              <button className='closebutton' onClick={resetForm}><RxCross2 /></button>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {selections.map((selection, index) => (
              <tr key={selection.selection_id}>
                <td>{index + 1}</td>
                <td>{selection.exam_name}</td>
                <td>{selection.subjects}</td>
                <td className='upddel'>
                  <button className="update" onClick={() => handleEdit(index)}>Update</button>
                  <button className="delete" onClick={() => handleDelete(selection.exam_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default ExamCreation;
 
 
 
 