import React,{useState,useEffect} from 'react'

import datadownload from '../components/Neetdata.js';
import '../styles/Downloadneet.css';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../images/logo.png';
import { FaAngleDown } from "react-icons/fa";
import img from '../images/img.png'
import bg2 from '../images/bbbh (1).png'
import pdf from '../images/pdf.png'

const Downloadneet = () => {
 
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
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
        setSelectedYear(null); 
        setSelectedMonth(null); 
      } else {
        setSelectedYear(year);
        setSelectedMonth(null); 
      }
    };
  
    const handleMonthClick = (monthData) => {
      if (monthData.monthName === selectedMonth?.monthName) {
        setSelectedMonth(null); 
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
    <div>
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
        <h1 className='jeeh1down'>NEET SOLVED PAPERS</h1>
      </div>
      <div className='divboxdd neetboxdd'>
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
             
            <div className='shift-data sdneet'>
              {/* <div className="shift-data1">
              <img src={bg2} className='sdi'/></div> */}
              <h2 className='sdh2'>{selectedShift.shift_name}</h2>
              <div className='pdfmpc neetpdf'>
             
                  
                    
                    
                  
                        <a href={selectedShift.physics_pdf}><strong>Physics PDF</strong></a>
                        <a href={selectedShift.chemistry_pdf}><strong>Chemistry PDF</strong></a>
                        <a href={selectedShift.botany_pdf}><strong>Botany PDF</strong></a>
                        <a href={selectedShift.zoology_pdf}><strong>Zoology PDF</strong></a>
                    
                  
                
               
              </div>

              <table className='downjeetable downneett'>
                <thead>
                  <tr>
                    <th>S.No</th>
                  
                    <th>Physics Link</th>
                    <th>Chemistry Link</th>
                    <th>Botony Link</th>
                    <th>Zoologyy Link</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedShift.items.map(item => (
                    <tr key={item['S.NO']}>
                      <td className='sno'><div className='snoc'>{item['S.NO']}</div></td>
                     
                      <td><div className="at"><a href={item.Physics_Link}>Physics_link</a></div></td>
                      <td><div className="at"><a href={item.Chemistry_Link}>Chemistry_link</a></div></td>
                      <td><div className="at"><a href={item.botany_Link}>Botany_link</a></div></td>
                      <td><div className="at"><a href={item.zoology_Link}>Zoology_link</a></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Downloadneet