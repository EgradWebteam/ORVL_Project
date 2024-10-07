import React, { useState, useEffect } from 'react';
import datadownload from '../components/datadownload.js';
import '../styles/mainsDownloadjee.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../images/logo.png';
import img from '../images/img.png'
import bg2 from '../images/bbbh (1).png'
import pdf from '../images/pdf.png'

const JeeMainsDownloading = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isBox1Visible, setIsBox1Visible] = useState(false);

  useEffect(() => {
    // Optional: Default initialization for testing
    const defaultYear = '2024';
    const defaultMonth = Object.entries(datadownload[defaultYear])[0][0];
    const defaultShift = Object.entries(Object.entries(datadownload[defaultYear])[0][1])[0][1]['shift1'];
    
    setSelectedYear(defaultYear);
    setSelectedMonth({ monthName: defaultMonth, shifts: Object.entries(datadownload[defaultYear][defaultMonth])[0][1] });
    setSelectedShift(defaultShift);
  }, []);

  const handleYearClick = (year) => {
    if (year === selectedYear) {
      setSelectedYear(null); // Collapse the current year
      setSelectedMonth(null); // Collapse the current month
    } else {
      setSelectedYear(year);
      setSelectedMonth(null); // Collapse the current month when selecting a new year
    }
  };

  const handleMonthClick = (monthData) => {
    if (monthData.monthName === selectedMonth?.monthName) {
      setSelectedMonth(null); // Collapse the current month
    } else {
      setSelectedMonth(monthData);
    }
  };

  const handleShiftClick = (shiftData) => {
    setSelectedShift(shiftData);
  };

  const click1 = () => {
    setIsBox1Visible(!isBox1Visible);
  };

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
      <div className='divboxdd'>
        <div className='divboxd'>
          
      <div className='img'>
        <img src={pdf} className='pdf'/>
        <img src={img} className='img1'/></div>
          <div className='year-container'>
            {Object.entries(datadownload).map(([year, months]) => (
              <div key={year} className='year-box'>
                
                <h2 onClick={() => handleYearClick(year)} className='h2box'>
                  {year}
                </h2>

                {selectedYear === year && (
                  <div className='ccontainer rectangle'>
                   
                    <div className='month-box'>
                    <h3 className='monthboxh3'>Months & Shifts</h3>
                      {Object.entries(months).map(([month, monthData]) => {
                        const [monthName, shifts] = Object.entries(monthData)[0];
                        return (
                          <div key={month} className='boxmonth'>
                    
                            <h4 onClick={() => handleMonthClick({ monthName, shifts })}>
                              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                            </h4>

                            {selectedMonth && selectedMonth.monthName === monthName && (
                              <div className='month-shifts'>
                                {Object.entries(selectedMonth.shifts).map(([shiftKey, shiftData]) => (
                                  <div
                                    className='shift-item'
                                    key={shiftKey}
                                    onClick={() => handleShiftClick(shiftData)}
                                  >
                                    <h4>{shiftKey}</h4>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
         
          {selectedShift && (
             
            <div className='shift-data'>
              {/* <div className="shift-data1">
              <img src={bg2} className='sdi'/></div> */}
              <h2 className='sdh2'>{selectedShift.shift_name}</h2>
              <div className='pdfmpc'>
             
                  
                    
                    
                        <a href={selectedShift.maths_pdf}><strong>Maths PDF</strong></a>
                        <a href={selectedShift.physics_pdf}><strong>Physics PDF</strong></a>
                        <a href={selectedShift.chemistry_pdf}><strong>Chemistry PDF</strong></a>
                    
                  
                
               
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
                      <td className='sno'><div className='snoc'>{item['S.NO']}</div></td>
                      <td><div className="at"><a href={item.Maths_Link}>math_link</a></div></td>
                      <td><div className="at"><a href={item.Physics_Link}>physics_link</a></div></td>
                      <td><div className="at"><a href={item.Chemistry_Link}>chemistry_link</a></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JeeMainsDownloading;
