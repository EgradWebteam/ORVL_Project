import React, { useState, useEffect } from 'react';
import datadownload from '../components/datadownload.js';
import '../styles/jeemainsdownload.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../images/logo.png';
import { FaAngleDown } from "react-icons/fa";

const JeeMainsdownload = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedMonthExpanded, setSelectedMonthExpanded] = useState(false);
  const [selectedYearExpanded, setSelectedYearExpanded] = useState(false);
  const [isBox1Visible, setIsBox1Visible] = useState(false);

  useEffect(() => {
    const defaultYear = '2024';
    const defaultMonth = Object.entries(datadownload[defaultYear])[0][0];
    const defaultShift = Object.entries(Object.entries(datadownload[defaultYear])[0][1])[0][1]['shift1'];
    
    setSelectedYear(defaultYear);
    setSelectedMonth({ monthName: defaultMonth, shifts: Object.entries(datadownload[defaultYear][defaultMonth])[0][1] });
    setSelectedShift(defaultShift);
  }, []);

  const handleYearClick = (year) => {
    if (year === selectedYear) {
      setSelectedYearExpanded(!selectedYearExpanded);
      return;
    }
    setSelectedYear(year);
    setSelectedMonth(null);
    setSelectedYearExpanded(!selectedYearExpanded);
  };

  const handleMonthClick = (monthData) => {
    if (monthData.monthName === selectedMonth?.monthName) {
      setSelectedMonthExpanded(!selectedMonthExpanded);
      return;
    }
    setSelectedMonth(monthData);
    setSelectedMonthExpanded(true); 
  };

  const handleShiftClick = (shiftData) => {
    setSelectedShift(shiftData);
  };

  const click1 = () => {
        
    if (isBox1Visible===false){
        setIsBox1Visible(true)
    }
    else{
        setIsBox1Visible(false)
    }
  
}

  return (
    <div className='divboxmain mainadvan'>
      <div className='headerjeedm'>
        <div className='headerjeed'>
          <img src={Logo_img} alt="Logo" />
        </div>
        <a className='jeeanchoring' href='/Home'>
          <IoMdHome /> Home
        </a>
      </div>

      <div className='divboxing'>
        <h1 className='jeeh1down'>JEE MAINS SOLVED PAPERS</h1>
      </div>

      <div className='divboxdd ddadv'>
        <div className='divboxd'>
          {Object.entries(datadownload).map(([year, months]) => (
            <div key={year} className='year-container'>
              <h2 onClick={() => handleYearClick(year)} className='h2box'>
                {year} <FaAngleDown className='fad' style={{ color: "white" }} />
              </h2>

              {selectedYear === year && selectedYearExpanded && (
                <div className='month-container'>
                  {Object.entries(months).map(([month, monthData]) => {
                    const [monthName, shifts] = Object.entries(monthData)[0];
                    return (
                      <div key={month} className='boxmonth'>
                        <h4 onClick={() => handleMonthClick({ monthName, shifts })}>
                          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} <FaAngleDown className='fam' style={{ color: "#000" }} />
                        </h4>

                        {selectedMonth && selectedMonth.monthName === monthName && selectedMonthExpanded && (
                          <div>
                            {Object.entries(selectedMonth.shifts).map(([shiftKey, shiftData]) => (
                              <h4
                                onClick={() => handleShiftClick(shiftData)}
                                key={shiftKey}
                              >
                                {shiftKey}
                              </h4>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedShift && (
          <div className='shift-data'>
            <h2 className='sdh2'>{selectedShift.shift_name}</h2>
            <div className='pdfmpc'>
              
            <ul>
                    <li  onClick={click1}  id ='dropdown'>Visit PDF
                    { isBox1Visible &&
              (<div className='exam_dropdown edc'>
                  
                 
                    <a href={selectedShift.maths_pdf}><strong>Maths PDF</strong></a>
             
                    <a href={selectedShift.physics_pdf}><strong>Physics PDF</strong></a>
               
          
                    <a href={selectedShift.chemistry_pdf}><strong>Chemistry PDF</strong></a>
                </div>)}
                </li>
                </ul>
             
             
            </div>

            <table className='downjeetable'>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Maths Link</th>
                  <th>Physics Link</th>
                  <th>Chemistry Link</th>
                </tr>
              </thead>
              <tbody>
                {selectedShift.items.map(item => (
                  <tr key={item['S.NO']}>
                    <td>{item['S.NO']}</td>
                    <td><a href={item.Maths_Link}>math_link</a></td>
                    <td><a href={item.Physics_Link}>physics_link</a></td>
                    <td><a href={item.Chemistry_Link}>chemistry_link</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JeeMainsdownload;
