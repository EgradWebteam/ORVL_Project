
import React from 'react'
import Main_img from './Images/browser-removebg-preview.15bc2498a41e2b07c4e8.png';
import "./main.css"
import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <div className='container'>
        <div className='subcontainer1 1'>
            <div className='container1'>
                <div className='container11' id='box'>
                <img src = {Main_img} />

                </div>
                <div className='container12' id='text'>
                <h2 >Welcome to eGRADTutor</h2>
                <p>...tutoring by grads from IIT's/IISc</p>
                </div>
            </div>
        </div>
        <div className='subcontainer2 2'>
            <div className='container2'>
               <div className='container21' id='box1 1'>
                    <div className='box11'>
                        <ul class="g ug">
                       
                            <Link to="/Ug" class="a" id="hi"><a >
                                <h3 className="h3" id="h"><span class="text">UG ENTRANCE EXAMS</span></h3>
                            </a> </Link>
                            <li className="li"><a href="/Jee" className='ANCHOR'>JEE <span> (Mains & Advanced) </span></a></li>
                            <li className="li"><a href="/Neet" className='ANCHOR'>NEET</a></li>
                            <li className="li"><a href="/Bitsat" className='ANCHOR'>BITSAT</a></li>
                            <li className="li"><a href="" className='ANCHOR'>VITEEE</a></li>
                        </ul>

                    
                    </div>
                </div>
                <div className='container22' id='box2 2'>
                    <div className='box22'>
                        <ul class="g pg">
                        <Link to="Pg" class="a" id="hi">
                            <a href="#home">
                                <h3 className="h3" id="he"><span class="text">PG ENTRANCE EXAMS</span></h3>
                            </a> </Link>

                                
                            <li className="li"><a href="" className='ANCHOR'>GATE</a></li>
                            <li className="li"><a href="" className='ANCHOR'>IIT-JAM</a></li>
                            <li className="li"><a href="" className='ANCHOR'>ESE</a></li>
                            <li className="li"><a href="" className='ANCHOR'>JEST</a></li>
                        </ul>

                    
                    </div>
                </div>

            </div>
        </div>
        

    </div>
  )
}

export default Main