import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../Images/image.png';
import Leftnavbar from './Leftnavbar';
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
  const [currentTopics, setCurrentTopics] = useState([]);
 
  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost:8000/ExamCreation/exams');
      setExams(response.data);
    } catch (error) {
      alert('Error fetching exams. Please try again.');
      console.error('Error fetching exams:', error);
    }
  };
 
  const fetchTopics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/TopicCreation/fetch-exam-subject-topic');
      setTopictable(response.data);
    } catch (error) {
      alert('Error fetching topics. Please try again.');
      console.error('Error fetching topics:', error);
    }
  };
 
  useEffect(() => {
    fetchExams();
    fetchTopics();
  }, []);
 
  useEffect(() => {
    if (selectedExam) {
      const fetchSubjects = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/ExamCreation/exam/${selectedExam}/subjects`);
          setSubjects(response.data);
        } catch (error) {
          alert('Error fetching subjects. Please try again.');
          console.error('Error fetching subjects:', error);
        }
      };
      fetchSubjects();
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
    // Initialize topics with one empty topic
    setTopics([{ subject_id: event.target.value, topic_name: '' }]);
  };
 
  const handleTopicChange = (index, value) => {
    setTopics(prevTopics => {
      const newTopics = [...prevTopics];
      newTopics[index] = value;
      return newTopics;
    });
  };
 
  const addTopic = () => {
    setTopics([...topics, { subject_id: selectedSubject, topic_name: '' }]);
  };
 
  const removeTopic = (index) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    const topicData = topics.map(topic => ({
      exam_id: selectedExam,
      subject_id: selectedSubject,
      topic_name: topic.topic_name,
    }));
 
    const uniqueTopics = Array.from(new Set(topicData.map(a => a.topic_name)))
      .map(name => {
        return topicData.find(a => a.topic_name === name);
      });
 
    try {
      await axios.post('http://localhost:8000/TopicCreation/submit-topics', { topics: uniqueTopics });
      alert('Topics saved successfully');
      fetchTopics();
      setModal1(false);
      setSelectedExam('');
      setSelectedSubject('');
      setSubjects([]);
      setTopics([]);
    } catch (error) {
      alert('Failed to save topics. Please try again.');
      console.error('Error saving topics:', error.response ? error.response.data : error.message);
    }
  };
 
  const handleDelete = async (topic_id) => {
    if (window.confirm('Are you sure you want to delete this selection?')) {
      try {
        await axios.delete(`http://localhost:8000/TopicCreation/topics/delete/${topic_id}`);
        alert('Selection deleted successfully');
        fetchTopics();
      } catch (error) {
        console.error('Error deleting selection:', error.message || error);
        alert('Failed to delete selection. Please try again.');
      }
    }
  };
 
  const handleEdit = async (topic) => {
    if (!topic || !topic.topic_id) {
        alert('No topic selected for editing.');
        return;
    }
 
    try {
        const response = await axios.get(`http://localhost:8000/TopicCreation/topics/${topic.topic_id}`);
        const fetchedTopics = response.data;
 
        if (Array.isArray(fetchedTopics) && fetchedTopics.length > 0) {
            setCurrentTopics(fetchedTopics);
            setSelectedExam(fetchedTopics[0].exam_id);
            setSelectedSubject(fetchedTopics[0].subject_id);
            setEditModal(true);
        } else {
            alert('No topics found for editing.');
        }
    } catch (error) {
        alert('Failed to fetch topic data. Please try again.');
        console.error('Error fetching topic for edit:', error);
    }
};
 
 
  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedData = currentTopics.map(topic => ({
        topic_id: topic.topic_id,
        topic_name: topic.topic_name,
    }));
 
    const nonEmptyTopics = updatedData.filter(topic => topic.topic_name.trim() !== '');
 
    try {
        await axios.put('http://localhost:8000/TopicCreation/topics/update', { topics: nonEmptyTopics });
        alert('Topics updated successfully');
        await fetchTopics(); // Ensure you await the fetch here
        setEditModal(false);
        setCurrentTopics([]); // Reset the current topics after update
    } catch (error) {
        alert('Failed to update topics. Please try again.');
        console.error('Error updating topics:', error.message);
    }
};
 
const addEditTopic = () => {
  setCurrentTopics([...currentTopics, { topic_id: '', topic_name: '' }]);
};
 
const removeEditTopic = (index) => {
  if (currentTopics.length > 1) {
      const updatedTopics = currentTopics.filter((_, i) => i !== index);
      setCurrentTopics(updatedTopics);
  }
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
      <button className='btnes' onClick={() => setModal1(true)}> Topic Creation</button>
 
      {/* Topic Creation Modal */}
      {modal1 && (
        <div className='examform'>
          <div className='modal'>
            <div className='content_m'>
              <h1>Topics Creation</h1>
              <form onSubmit={handleSubmit}>
                <div className='div1'>
                  <label htmlFor="exam">Select Exam:</label>
                  <select id="examCOURSE" className='dropdown' value={selectedExam} onChange={handleExamChange}>
                    <option value="">--Select an exam--</option>
                    {exams.map(exam => (
                      <option key={exam.exam_id} value={exam.exam_id}>{exam.exam_name}</option>
                    ))}
                  </select>
                </div>
                {subjects.length > 0 && (
                  <div className='div1'>
                    <label htmlFor="subject-dropdown">Select Subject:</label>
                    <select id="subject-dropdown" value={selectedSubject} onChange={handleSubjectChange} className="dropdown">
                      <option value="">Select a subject</option>
                      {subjects.map(subject => (
                        <option key={subject.subject_id} value={subject.subject_id}>
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
                        <div key={index} className="topic-entry">
                          <input
                            type="text"
                            value={topic.topic_name}
                            onChange={(event) => {
                              const updatedTopics = [...topics];
                              updatedTopics[index].topic_name = event.target.value;
                              setTopics(updatedTopics);
                            }}
                            placeholder="Enter topic name"
                            className='input'
                          />
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={addTopic}>+</button>
                    {topics.length > 1 && (
                      <button type="button" onClick={() => removeTopic(topics.length - 1)}>-</button>
                    )}
                  </div>
                )}
                <button type="submit">Submit Selection</button>
              </form>
              <button className='closebutton' onClick={() => setModal1(false)}><RxCross2 /></button>
            </div>
          </div>
        </div>
      )}
 
      {/* Edit Topic Modal */}
      {editModal && (
        <div className='examform'>
          <div className='modal'>
            <div className='content_m'>
              <h1>Edit Topics</h1>
              <form onSubmit={handleUpdate}>
                <div className='div1'>
                  <label htmlFor="exam">Exam Name:</label>
                  <select
                    id="exam"
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className='dropdown'
                  >
                    <option value="">--Select an exam--</option>
                    {exams.map(exam => (
                      <option key={exam.exam_id} value={exam.exam_id}>{exam.exam_name}</option>
                    ))}
                  </select>
                </div>
                <div className='div1'>
                  <label htmlFor="subject">Subject Name:</label>
                  <select
                    id="subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className='dropdown'
                  >
                    <option value="">--Select a subject--</option>
                    {subjects.map(subject => (
                      <option key={subject.subject_id} value={subject.subject_id}>{subject.subject_name}</option>
                    ))}
                  </select>
                </div>
                <div className='div1'>
                  <h3 className='headertv'>Edit Topic Names:</h3>
                  <div className='topics_inp'>
                  {currentTopics.map((topic, index) => (
  <div key={index} className="topic-entry">
    <input
      type="text"
      value={topic.topic_name}
      onChange={(event) => {
        const updatedTopics = [...currentTopics];
        updatedTopics[index].topic_name = event.target.value;
        setCurrentTopics(updatedTopics);
      }}
      placeholder="Enter topic name"
      className='input'
    />
  </div>
))}
 
                  </div>
                  <button type="button" onClick={addEditTopic}>+</button>
                  {currentTopics.length > 1 && (
                    <button type="button" onClick={() => removeEditTopic(currentTopics.length - 1)}>-</button>
                  )}
                </div>
                <button type="submit">Update Topics</button>
                <button className='closebutton' onClick={() => setEditModal(false)}><RxCross2 /></button>
              </form>
            </div>
          </div>
        </div>
      )}
 
      {/* Topics Table */}
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
                  <button className="update" onClick={() => handleEdit(topict)}>Update</button>
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
 
 
 