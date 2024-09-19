import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from './Images/image.png';
import Leftnavbar from '../components/Leftnavbar';
import { RxCross2 } from "react-icons/rx";

const Topics = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState([]);
  const [modal1, setModal1] = useState(false);
  const [topictable, setTopictable] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);

  const toggleModal1 = () => {
    setModal1(!modal1);
  };

  const toggleEditModal = () => {
    setEditModal(!editModal);
  };

  useEffect(() => {
    axios.get('http://localhost:8000/api/exams')
      .then(response => {
        console.log('Fetched exams:', response.data);
        setExams(response.data);
      })
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/topics')
      .then(response => {
        console.log('Fetched topics:', response.data);
        setTopictable(response.data);
      })
      .catch(error => console.error('Error fetching topics:', error));
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
      setSelectedSubject('');
      setTopics([]);
    }
  }, [selectedExam]);

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
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

    const topicData = topics.map(topic => ({
      exam_id: selectedExam,
      subject_id: topic.subject_id,
      topic_name: topic.topic_name
    }));

    axios.post('http://localhost:8000/api/submit-topics', { topics: topicData })
      .then(() => {
        alert('Topics saved successfully');
        return axios.get('http://localhost:8000/api/topics');
      })
      .then(response => {
        setTopictable(response.data);
        setModal1(false);
        setSelectedExam('');
        setSelectedSubject('');
        setSubjects([]);
        setTopics([]);
      })
      .catch(error => console.error('Error saving topics:', error));
  };

  const handleDelete = (topic_id) => {
    axios.delete(`http://localhost:8000/api/topics/delete/${topic_id}`)
      .then(() => {
        alert('Topic deleted successfully');
        return axios.get('http://localhost:8000/api/topics');
      })
      .then(response => {
        setTopictable(response.data);
      })
      .catch(error => console.error('Error deleting topic:', error));
  };

  const handleEdit = (topic) => {
    setCurrentTopic(topic);
    setSelectedExam(topic.exam_id); // Set selected exam
    setSelectedSubject(topic.subject_id); // Set selected subject
    setEditModal(true);
  };

 

  const handleUpdate = (event) => {
    event.preventDefault();
  
    const updatedTopicData = [{
      exam_id: selectedExam,
      subject_id: selectedSubject,
      topic_name: currentTopic.topic_name,
    }];
  
    // Send the updated topic to the backend using POST
    axios.post('http://localhost:8000/api/submit-topics', { topics: updatedTopicData })
      .then(() => {
        alert('Topic updated successfully');
        // Fetch the updated topics list from the backend
        return axios.get('http://localhost:8000/api/topics');
      })
      .then(response => {
        setTopictable(response.data); // Update the table with new data
        setEditModal(false); // Close the edit modal
        setCurrentTopic(null); // Clear current topic state
      })
      .catch(error => {
        console.error('Error updating topic:', error);
        alert('Failed to update the topic. Please try again.');
      });
  };
  
  return (
    <div>
      <div className='headerjeem'>
        <div className='headerjee'>
          <img src={Logo_img} alt="logo" />
        </div>
        <a className='jeeanchor' href='/Home'>
          <IoMdHome /> Home
        </a>
      </div>
      <Leftnavbar />
      <button className='btnes' onClick={toggleModal1}> Topic Creation</button>

      {modal1 && (
        <div className='examform'>
          <div className='modal'>
            <div className='overlay'></div>
            <div className='content_m'>
              <h1>Topics Creation</h1>
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
                      value={selectedSubject}
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
                    <h3 className='headertv'>Enter Topics:</h3>
                    <div className='topics_inp'>
                      {topics.map((topic, index) => (
                        <div key={`${topic.subject_id}-${index}`} className="topic-entry">
                          <input
                            type="text"
                            value={topic.topic_name}
                            onChange={(event) => handleTopicChange(index, event)}
                            placeholder="Enter topic name"
                            className='input'
                          />
                          <div className='btngap'>
                            <button type="button" onClick={handleAddTopic}>+</button>
                            <button type="button" onClick={() => handleRemoveTopic(index)}>-</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button type="submit">Submit Selection</button>
              </form>
              <button className='closebutton' onClick={toggleModal1}><RxCross2 /></button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className='examform'>
          <div className='modal'>
            <div className='overlay'></div>
            <div className='content_m'>
              <h1>Edit Topic</h1>
              <form onSubmit={handleUpdate}>
                <div className='div1'>
                  <label htmlFor="exam">Exam Name:</label>
                  <select id="exam" value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className='dropdown'>
                    <option value="">--Select an exam--</option>
                    {exams.map(exam => (
                      <option key={exam.exam_id} value={exam.exam_id}>{exam.exam_name}</option>
                    ))}
                  </select>
                </div>
                <div className='div1'>
                  <label htmlFor="subject">Subject Name:</label>
                  <select id="subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className='dropdown'>
                    <option value="">--Select a subject--</option>
                    {subjects.map(subject => (
                      <option key={subject.subject_id} value={subject.subject_id}>{subject.subject_name}</option>
                    ))}
                  </select>
                </div>
                <div className='div1'>
                  <label htmlFor="topic">Topic Name:</label>
                  <input
                    type="text"
                    value={currentTopic?.topic_name}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, topic_name: e.target.value })}
                  />
                </div>
                <button type="submit">Update Topic</button>
                <button className='closebutton' onClick={toggleEditModal}><RxCross2 /></button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className='selections-tablecontainer'>
        <h2>Topics Table</h2>
        <table className='selections-table'>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Exam Name</th>
              <th>Subject Name</th>
              <th>Topic Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topictable.map((topict, index) => (
              <tr key={topict.topic_id}>
                <td>{index + 1}</td>
                <td>{topict.exam_name}</td>
                <td>{topict.subject_name}</td>
                <td>{topict.topics}</td>
                <td className='upddel'>
                  <button  className="update" onClick={() => handleEdit(topict)}>Update</button>
                  <button className='delete' onClick={() => handleDelete(topict.topic_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Topics;
