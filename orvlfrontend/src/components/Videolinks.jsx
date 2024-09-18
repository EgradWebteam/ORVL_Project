import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/MainsForm.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from './Images/image.png';
import Leftnavbar from '../components/Leftnavbar';
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

  const toggleModal1 = () => {
    setModal1(!modal1);
  };

  useEffect(() => {
    // Fetch exams when component mounts
    axios.get('http://localhost:8000/api/exams')
      .then(response => {
        setExams(response.data);
      })
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  useEffect(() => {
    // Fetch video table data when component mounts
    axios.get('http://localhost:8000/api/videos')
      .then(response => {
        setVideotable(response.data);
      })
      .catch(error => console.error('Error fetching video table data:', error));
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
  
    axios.post('http://localhost:8000/api/submit-selection', examData)
      .then(() => axios.post('http://localhost:8000/api/submit-videos', { videos: videoData }))
      .then(() => {
        alert('Selection and video links saved successfully');
        // Fetch updated video table data
        return axios.get('http://localhost:8000/api/videos', {
          params: {
            examId: selectedExam,
            subjectId: selectedSubject,
            topicId: selectedTopic
          }
        });
      })
      .then(response => {
        setVideotable(response.data);
        setModal1(false);
        setSelectedExam('');
        setSelectedSubject('');
        setSubjects([]);
        setTopics([]);
        setSelectedTopic('');
        setVideos([{ video_name: '', video_link: '' }]);
      })
      .catch(error => {
        console.error('Error saving selection or videos:', error);
        alert('An error occurred. Please check the console for more details.');
      });
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
      <button className='btnes' onClick={toggleModal1}> Video Upload</button>

      {modal1 && (
        <div className='examform '>
          <div className='modal'>
            <div className='overlay'></div>
            <div className='content_m'>
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
                  <div className='div1'>
                    <div className='video-inputs'>
                      <h3 className='headertv'>Add Video Links with  Video Names:</h3>
                      {videos.map((video, index) => (
                        <div key={index} className='video-input-group'>
                          <input
                            type='text'
                            placeholder='Video Name'
                            value={video.video_name}
                            onChange={(e) => handleVideoChange(index, 'video_name', e.target.value)}
                            className=' input inputvideo'
                          />
                          <input
                            type='text'
                            placeholder='Video Link'
                            value={video.video_link}
                            onChange={(e) => handleVideoChange(index, 'video_link', e.target.value)}
                            className=' input inputvideo'
                          />
                          <div className='btngap'>
                            <button type='button' onClick={addVideoInput} className='btn plus'>+</button>
                            <button type='button' onClick={() => removeVideoInput(index)} className='btn minus'>-</button>
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
      <div className='selections-tablecontainer'>
        <h2>Video Links Table</h2>
        <table className='selections-table'>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Exam Name</th>
              <th>Subject Name</th>
              <th>Topic Name</th>
              <th>Video Name</th>
              <th>Video Link</th>
            </tr>
          </thead>
          <tbody>
            {videotable.map((videot, index) => (
              <tr key={videot.video_id}>
                <td>{index + 1}</td>
                <td>{videot.exam_name}</td>
                <td>{videot.subject_name}</td>
                <td>{videot.topic_name}</td>
                <td>{videot.video_name}</td>
                <td><a href={videot.video_link} target="_blank" rel="noopener noreferrer">Watch</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Videolinks;
