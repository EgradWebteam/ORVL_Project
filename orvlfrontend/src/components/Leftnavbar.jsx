import React, { useState, useEffect } from 'react';
import '../components/MainsForm.css';

const Leftnavbar = () => {
  // State to keep track of the active button
  const [activeButton, setActiveButton] = useState('');

  // Effect to update active button based on current path
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setActiveButton('Exam');
    } else if (path === '/topics') {
      setActiveButton('Topic');
    } else if (path === '/videolinks') {
      setActiveButton('Videos');
    }
  }, [window.location.pathname]);

  return (
    <div>
      <div className="sidebar">
        <a href="/">
          <button className={`nav-button ${activeButton === 'Exam' ? 'active' : ''}`}>
            Exam
          </button>
        </a>
        <a href="/topics">
          <button className={`nav-button ${activeButton === 'Topic' ? 'active' : ''}`}>
            Topic
          </button>
        </a>
        <a href="/videolinks">
          <button className={`nav-button ${activeButton === 'Videos' ? 'active' : ''}`}>
            Videos
          </button>
        </a>
      </div>
    </div>
  );
};

export default Leftnavbar;
