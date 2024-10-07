import React from 'react'
import img1 from '../images/ONLINE TEST SERIES.070dce0d2ef8035c6c23.png'
import img2 from '../images/onlinets.983260b34e9e35c6d29a.png'
import '../stylesjee/jeecourses.css'
const Jeecourses = () => {
  return (
    <div className='coursesmain'>
     <div className='couhead'>
          <h1 className='couh1'>
          JEE (MAINS & ADVANCED) COURSES
          </h1>
        </div>
        
        <div className='courseslist'>
          <div className='courseflex'>
          
            <div className='coursecard'>
              <div className='text-image'>
                <div className='headtext'>
                  <h2>ONLINE TEST SERIES</h2>
                </div>
                <div className='corimg'>
                  <img src={img1}/>
                </div>
              </div>
              <div className='butn'>
              <button className='cbtn'><a href='/Jeets' className='ac'>Explore </a></button> 
              </div>

            </div>
            <div className='coursecard'>
              <div className='text-image'>
                <div className='headtext'>
                  <h2>LIVE CLASSES</h2>
                </div>
                <div className='corimg'>
                  <img src={img2}/>
                </div>
              </div>
              <div className='butn'>
              <button className='cbtn'><a href='/Jeeolv' className='ac'>Explore </a></button> 
              </div>

            </div>
          </div>
        </div>
      </div>
   
  )
}

export default Jeecourses