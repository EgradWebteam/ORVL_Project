import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../Images/image.png';
import Leftnavbar from './Leftnavbar';
import { RxCross2 } from "react-icons/rx";

const Videolinks = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [videos, setVideos] = useState([{ video_name: '', video_link: '' }]);
  const [videotable, setVideotable] = useState([]);
  const [modal1, setModal1] = useState(false);
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);

  const toggleModal1 = () => {
    setModal1(!modal1);
    if (modal1) resetForm();
  };

  const resetForm = () => {
    setSelectedExam('');
    setSelectedSubject('');
    setSubjects([]);
    setTopics([]);
    setSelectedTopic('');
    setVideos([{ video_name: '', video_link: '' }]);
    setEditingVideoIndex(null);
  };

  useEffect(() => {
    axios.get('http://localhost:8000/ExamCreation/exams')
      .then(response => setExams(response.data))
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  useEffect(() => {
    if (selectedExam) {
      axios.get(`http://localhost:8000/ExamCreation/exam/${selectedExam}/subjects`)
        .then(response => setSubjects(response.data))
        .catch(error => console.error('Error fetching subjects:', error));
    } else {
      resetForm();
    }
  }, [selectedExam]);

  useEffect(() => {
    if (selectedSubject) {
      axios.get(`http://localhost:8000/TopicCreation/subjects/${selectedSubject}/topics`)
        .then(response => setTopics(response.data))
        .catch(error => console.error('Error fetching topics:', error));
    } else {
      setTopics([]);
      setSelectedTopic('');
      setVideos([{ video_name: '', video_link: '' }]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    fetchVideoTableData();
  }, []);

  const fetchVideoTableData = () => {
    axios.get('http://localhost:8000/VideoCreation/fetch-videos', {
      params: {
        examId: selectedExam,
        subjectId: selectedSubject,
        topicId: selectedTopic,
      }
    })
      .then(response => {
        console.log('Video Table Data:', response.data);
        setVideotable(response.data);
      })
      .catch(error => console.error('Error fetching video table data:', error));
  };

  const handleExamChange = (event) => setSelectedExam(event.target.value);
  
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setTopics([]);
    setSelectedTopic('');
    setVideos([{ video_name: '', video_link: '' }]);
  };
  
  const handleTopicChange = (event) => setSelectedTopic(event.target.value);

  const handleVideoChange = (index, field, value) => {
    const newVideos = [...videos];
    newVideos[index][field] = value;
    setVideos(newVideos);
  };

  const addVideoInput = () => setVideos([...videos, { video_name: '', video_link: '' }]);

  const removeVideoInput = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const videoData = videos.map(video => ({
      exam_id: selectedExam,
      subject_id: selectedSubject,
      topic_id: selectedTopic,
      video_name: video.video_name,
      video_link: video.video_link
    }));

    if (editingVideoIndex !== null) {
      await Promise.all(videoData.map((data, idx) => 
        axios.put(`http://localhost:8000/VideoCreation/update-videos/${videotable[idx].video_id}`, data)
      ));
      alert('Videos updated successfully');
    } else {
      await axios.post('http://localhost:8000/VideoCreation/create-videos', { videos: videoData });
      alert('Videos uploaded successfully');
    }

    fetchVideoTableData();
    resetForm();
    setModal1(false);
  };

  const handleEditVideo = (index) => {
    const videoToEdit = videotable[index];
    setEditingVideoIndex(index);
    setSelectedExam(videoToEdit.exam_id);
    setSelectedSubject(videoToEdit.subject_id);
    setSelectedTopic(videoToEdit.topic_id);
    setVideos([{ video_name: videoToEdit.video_names, video_link: videoToEdit.video_links }]); // Only set one video for editing
    setModal1(true);
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      axios.delete(`http://localhost:8000/VideoCreation/delete-videos/${videoId}`)
        .then(() => {
          alert('Video deleted successfully');
          fetchVideoTableData();
        })
        .catch(error => {
          console.error('Error deleting video:', error);
          alert('An error occurred while deleting the video.');
        });
    }
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
        <h1> Video Upload Page</h1>
      </div>
      <button className='btnes' onClick={toggleModal1}> Video Upload</button>
      {modal1 && (
        <div className='examform'>
          <div className='modal'>
            <div className='content_s'>
              <h1>{editingVideoIndex !== null ? 'Edit Video' : 'Video Upload'}</h1>
              <form onSubmit={handleSubmit}>
                <div className='div1'>
                  <label htmlFor="exam">Select Exam:</label>
                  <select
                    id="exam"
                    className='dropdown dd1'
                    value={selectedExam}
                    onChange={handleExamChange}
                  >
                    <option value="">--Select an exam--</option>
                    {exams.map(exam => (
                      <option key={exam.exam_id} value={exam.exam_id}>
                        {exam.exam_name}
                      </option>
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
                      className="dropdown dd2"
                    >
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
                    <label htmlFor="topic-dropdown">Select Topic:</label>
                    <select
                      id="topic-dropdown"
                      value={selectedTopic}
                      onChange={handleTopicChange}
                      className="dropdown dd1"
                    >
                      <option value="">Select a topic</option>
                      {topics.map(topic => (
                        <option key={topic.topic_id} value={topic.topic_id}>
                          {topic.topic_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {selectedTopic && (
                  <div className='div1'>
                    <div className='video-inputs'>
                      <h3 className='headertv'>{editingVideoIndex !== null ? 'Edit Video Name and Video Links' : 'Add Video Links with Video Names:'}</h3>
                      {videos.map((video, index) => (
                        <div className='inputbtnflex' key={index}>
                          <div className='video-input-group'>
                            <input
                              type='text'
                              placeholder='Video Name'
                              value={video.video_name}
                              onChange={(e) => handleVideoChange(index, 'video_name', e.target.value)}
                              className='input inputvideo'
                            />
                            <input
                              type='text'
                              placeholder='Video Link'
                              value={video.video_link}
                              onChange={(e) => handleVideoChange(index, 'video_link', e.target.value)}
                              className='input inputvideo'
                            />
                            <button type='button' onClick={() => removeVideoInput(index)} className='remove-button'>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      <button type='button' onClick={addVideoInput} className='add-button'>Add Video</button>
                    </div>
                  </div>
                )}
                <div className='btns'>
                  <button type='submit' className='submit-btn'>
                    {editingVideoIndex !== null ? 'Update Video' : 'Upload Videos'}
                  </button>
                  <button type='button' className='cancel-btn' onClick={toggleModal1}>
                    <RxCross2 /> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className='selections-tablecontainer'>
        <table className='selections-table'>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Exam Name</th>
              <th>Subject Name</th>
              <th>Topic Name</th>
              <th>Video Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {videotable.map((videot, index) => (
              <tr key={videot.video_id}>
                <td>{index + 1}</td>
                <td>{videot.exam_name}</td>
                <td>{videot.subject_name}</td>
                <td>{videot.topic_name}</td>
                <td>{videot.video_names}</td>
                <td className='upddel'>
                  <button onClick={() => handleEditVideo(index)} className='update'>Update</button>
                  <button onClick={() => handleDeleteVideo(videot.video_id)} className="delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Videolinks;
