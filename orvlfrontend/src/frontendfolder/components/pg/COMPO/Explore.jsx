import React from 'react'
import '../STYLES/Explore.css'
import { FaGreaterThan } from "react-icons/fa6";

const Explore = () => {
  return (
    <div className='main'>
        <div className='sub'  id='Exams' >
            <div className='textl'>
                <h1>EXPLORE EXAMS</h1>
            </div>


        </div>
        <div className='grid_cards'>
            <div className='card'>
                <div className='card_gr'>
                    <div className='cardhead'>
                        <a className='anb'>
                            <h4>GATE
                            </h4>
                            <i class="uil uil-angle-right icon">
                            <FaGreaterThan />
                            </i>
                        </a>

                    </div>
                    <div className='cardbody'>
                        
                    <a>
                            <h5>Online Test Series</h5>
                            
                    </a>
                    <a>
                            <h5>
                            Online Live Video Classes  
                            </h5>
                           
                            
                    </a>
                    </div>
                </div>

            </div>
            <div className='card'>
                <div className='card_gr'>
                    <div className='cardhead'>
                        <a className='anb'>
                            <h4>IITJAM</h4>
                           
                            <FaGreaterThan className='uil'/>
                            
                        </a>

                    </div>
                    <div className='cardbody'>
                        
                        <a>
                            <h5>
                            Online Test Series 
                            </h5>
                            
                        </a>
                        <a>
                            <h5>
                            Online Live Video Classes 
                            </h5>
                            
                        </a>
                    </div>
                </div>

            </div>
            <div className='card'>
                <div className='card_gr'>
                    <div className='cardhead'>
                        <a className='anb'>
                            <h4>ESE</h4>
                          
                            <div className='uil'><FaGreaterThan/></div>
                           
                            
                        </a>

                    </div>
                    <div className='cardbody'>
                        
                    <a>
                            <h5>
                            Online Test Series
                            </h5>
                           
                            
                        </a>
                    </div>
                </div>

            </div>
            <div className='card'>
                <div className='card_gr'>
                    <div className='cardhead'>
                        <a className='anb'>
                            <h4>ISRO</h4>
                            <i class="uil uil-angle-right icon">
                            <FaGreaterThan />
                            </i>
                        </a>

                    </div>
                    <div className='cardbody'>
                        
                    <a>
                            <h5>
                            Online Test Series 
                            </h5>
                            
                        </a>
                    </div>
                </div>

            </div>
            <div className='card'>
                <div className='card_gr'>
                    <div className='cardhead'>
                        <a className='anb'>
                            <h4>BARC</h4>
                            <i class="uil uil-angle-right icon">
                            <FaGreaterThan />
                            </i>
                        </a>

                    </div>
                    <div className='cardbody'>
                        
                    <a>
                            <h5>
                            Online Test Series  
                            </h5>
                            
                        </a>
                    </div>
                </div>

            </div>
            <div className='card'>
                <div className='card_gr'>
                    <div className='cardhead'>
                        <a className='anb'>
                            <h4>JEST</h4>
                            <i class="uil uil-angle-right icon">
                            <FaGreaterThan />
                            </i>
                        </a>

                    </div>
                    <div className='cardbody'>
                        
                    <a>
                            <h5>
                            Online Test Series 
                            </h5>
                            
                        </a>
                    </div>
                </div>

            </div>
        </div>
        
    </div>
  )
}

export default Explore