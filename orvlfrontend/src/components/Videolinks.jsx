import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from './Images/image.png';
import Leftnavbar from '../components/Leftnavbar';

const Videolinks = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [videos, setVideos] = useState([{ video_name: '', video_link: '' }]);

  useEffect(() => {
    // Fetch exams when component mounts
    axios.get('http://localhost:8000/api/exams')
      .then(response => {
        setExams(response.data);
      })
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  useEffect(() => {
    // Fetch subjects when an exam is selected
    if (selectedExam) {
      axios.get(`http://localhost:8000/api/exam/${selectedExam}/subjects`)
        .then(response => {
          setSubjects(response.data);
        })
        .catch(error => console.error('Error fetching subjects:', error));
    } else {
      setSubjects([]);
      setSelectedSubject('');
      setTopics([]);
    }
  }, [selectedExam]);

  useEffect(() => {
    // Fetch topics when a subject is selected
    if (selectedSubject) {
      axios.get(`http://localhost:8000/api/subjects/${selectedSubject}/topics`)
        .then(response => {
          setTopics(response.data);
        })
        .catch(error => console.error('Error fetching topics:', error));
    } else {
      setTopics([]);
      setSelectedTopic('');
      setVideos([{ video_name: '', video_link: '' }]);
    }
  }, [selectedSubject]);

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setTopics([]);
    setSelectedTopic('');
    setVideos([{ video_name: '', video_link: '' }]);
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
    setVideos([{ video_name: '', video_link: '' }]); // Initialize with one empty video input
  };

  const handleVideoChange = (index, field, value) => {
    const newVideos = [...videos];
    newVideos[index][field] = value;
    setVideos(newVideos);
  };

  const addVideoInput = () => {
    setVideos([...videos, { video_name: '', video_link: '' }]);
  };

  const removeVideoInput = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare data for submission
    const examData = {
        exam_id: selectedExam,
        selectedsubjects: [selectedSubject],
        selectedtopic: [selectedTopic]
    };

    const videoData = videos.map(video => ({
        exam_id: selectedExam,
        subject_id: selectedSubject,
        topic_id: selectedTopic,
        video_name: video.video_name,
        video_link: video.video_link
    }));

    // Post selection data
    axios.post('http://localhost:8000/api/submit-selection', examData)
        .then(() => axios.post('http://localhost:8000/api/submit-videos', { videos: videoData }))
        .then(() => alert('Selection and video links saved successfully'))
        .catch(error => console.error('Error saving selection or videos:', error));
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
      <div className='examform longform'>
        <h1>Video Upload</h1>
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
              <label htmlFor="topic-dropdown">Select Topic:</label>
              <select
                id="topic-dropdown"
                value={selectedTopic}
                onChange={handleTopicChange}
                className="dropdown"
              >
                <option value="">Select a topic</option>
                {topics.map(topic => (
                  <option
                    key={topic.topic_id}
                    value={topic.topic_id}
                  >
                    {topic.topic_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedTopic && (
            <div className='video-inputs'>
              {videos.map((video, index) => (
                <div key={index} className='video-input-group'>
                  <input
                    type='text'
                    placeholder='Video Name'
                    value={video.video_name}
                    onChange={(e) => handleVideoChange(index, 'video_name', e.target.value)}
                  />
                  <input
                    type='text'
                    placeholder='Video Link'
                    value={video.video_link}
                    onChange={(e) => handleVideoChange(index, 'video_link', e.target.value)}
                  />
                  <button type='button' onClick={() => removeVideoInput(index)}>-</button>
                </div>
              ))}
              <button type='button' onClick={addVideoInput}>+</button>
            </div>
          )}
          <button type="submit">Submit Selection</button>
        </form>
      </div>
    </div>
  );
};

export default Videolinks;
