import React from 'react'
import img1 from '../images/img1.png'
import img2 from '../images/img2.png'
import '../styles/NeetExplore.css'
const NeetExplore = () => {
  return (
    <div className='neet'>
         
     <div className='couhead neth1'>
          <h1 className='couh1 '>
          NEET COURSES
          </h1>
        </div>
        
        <div className='courseslist'>
          <div className='courseflex'>
          
            <div className='coursecard'>
              <div className='text-image'>
                <div className='headtext'>
                  <h2>ONLINE TEST SERIES</h2>
                </div>
                <div className='corimg corneetimg'>
                  <img src={img1}/>
                </div>
              </div>
              <div className='butn'>
               <button className='cbtn'><a href='/Neetots' className='ac'>Explore </a></button> 
              </div>

            </div>
            <div className='coursecard'>
              <div className='text-image'>
                <div className='headtext'>
                  <h2>LIVE CLASSES</h2>
                </div>
                <div className='corimg corneetimg'>
                  <img src={img2}/>
                </div>
              </div>
              <div className='butn'>
              <button className='cbtn'><a href='/Neetolv' className='ac'>Explore </a></button> 
              </div>

            </div>
          </div>
        </div>
      </div>
   
  )
}

export default NeetExplore