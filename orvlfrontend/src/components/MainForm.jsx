import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from './Images/image.png';
import Leftnavbar from '../components/Leftnavbar';
import { RxCross2 } from "react-icons/rx";

const MainForm = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selections, setSelections] = useState([]);
  const [editingSelection, setEditingSelection] = useState(null);

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

  // Fetch initial selections
  useEffect(() => {
    axios.get('http://localhost:8000/api/selections')
      .then(response => {
        setSelections(response.data);
      })
      .catch(error => console.error('Error fetching selections:', error));
  }, []);

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

    const request = editingSelection
      ? axios.put(`http://localhost:8000/api/selections/update/${editingSelection}`, data)
      : axios.post('http://localhost:8000/api/submit-selection', data);

    request
      .then(() => {
        alert(`${editingSelection ? 'Selection updated' : 'Selection saved'} successfully`);
        return axios.get('http://localhost:8000/api/selections');
      })
      .then(response => {
        setSelections(response.data);
        resetForm();
      })
      .catch(error => console.error('Error saving selection:', error));
  };

  const handleEdit = (selection) => {
    setSelectedExam(selection.exam_id);
    setSelectedSubjects(selection.subjects.split(', ').map(sub => sub.trim())); // Split subjects if needed
    setEditingSelection(selection.selection_id);
    setModalOpen(true);
  };
  // const handleDelete = (selection_id) => {
  //   console.log("Attempting to delete selection with ID:", selection_id); // Add this line
  //   if (window.confirm('Are you sure you want to delete this selection?')) {
  //     axios.delete(`http://localhost:8000/api/selections/delete/${selection_id}`)
  //       .then(() => {
  //         alert('Selection deleted successfully');
  //         return axios.get('http://localhost:8000/api/selections');
  //       })
  //       .then(response => {
  //         setSelections(response.data);
  //       })
  //       .catch(error => {
  //         console.error('Error deleting selection:', error.message || error);
  //         alert('Failed to delete selection. Please try again.'); // User-friendly message
  //       });
  //   }
  // };
  // const handleDelete = (selection_id) => {
  //   console.log("Attempting to delete selection with ID:", selection_id); // Add this line
  //   if (window.confirm('Are you sure you want to delete this selection?')) {
  //     axios.delete(`http://localhost:8000/api/selections/delete/${selection_id}`)
  //       .then(() => {
  //         alert('Selection deleted successfully');
  //         return axios.get('http://localhost:8000/api/selections');
  //       })
  //       .then(response => {
  //         setSelections(response.data);
  //       })
  //       .catch(error => {
  //         console.error('Error deleting selection:', error.message || error);
  //         alert('Failed to delete selection. Please try again.');
  //       });
  //   }
  // };
  const handleDelete = (exam_id) => {
    console.log("Attempting to delete selection with exam_id:", exam_id); // Log the ID
    if (window.confirm('Are you sure you want to delete this selection?')) {
      axios.delete(`http://localhost:8000/api/selections/delete/${exam_id}`)
        .then(() => {
          alert('Selection deleted successfully');
          return axios.get('http://localhost:8000/api/selections');
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
  
  // Update the delete button in the table

  
  const resetForm = () => {
    setModalOpen(false);
    setSelectedExam('');
    setSelectedSubjects([]);
    setSubjects([]);
    setEditingSelection(null);
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

      <button className='btnes' onClick={() => setModalOpen(true)}>Exam Selection</button>

      {modalOpen && (
        <div className='examform'>
          <div className='modal'>
            <div className='overlay'></div>
            <div className='content_m'>
              <h1>{editingSelection ? 'Edit Selection' : 'Exam Selection'}</h1>
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
                    
                          onChange={handleSubjectChange}
                          className="checkbox-input"
                        />
                        <label className="checkb" htmlFor={`subject-${subject.subject_id}`}>{subject.subject_name}</label>
                      </div>
                    ))}
                  </div>
                )}
                <button type="submit">{editingSelection ? 'Update Selection' : 'Submit Selection'}</button>
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
                <td>
    <button onClick={() => handleEdit(selection)}>Edit</button>
    <button onClick={() => handleDelete(selection.exam_id)}>Delete</button> {/* Pass exam_id */}
  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainForm;
