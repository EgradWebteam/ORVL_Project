import React from 'react'
import Exam_Img from '../Images/exam.png'
import styled from 'styled-components';

import '../styles/ExploreExam.css'
import { Link } from 'react-router-dom'

const ExploreExam = () => {
  return (
    <div id="exam">
        <h2 className='examh2'>EXPLORE EXAM</h2>
      
            <div className='subcontaineree'>
                <div className='ee_grid'>
                    <div>
                        <div className='ebox'>
                            <Link to ="/Jee"  className='ebtn'><a className='ebtn'>JEE</a></Link>
                            
                            <a className='ebtn_n' href='/Jeets'>online test series</a>
                            <a className='ebtn_n' href='/Jeeolv'>online live video class</a>
                        </div>
                    </div>
                    <div>
                        <div className='ebox'>
                            <a className='ebtn' href='/Neet'>NEET</a>
                            <a className='ebtn_n' href='/Neetots'>online test series</a>
                            <a className='ebtn_n' href='/Neetolv'>online live video class</a>
                        </div>
                    </div>
                    <div>
                        <div className='ebox'>
                            <a className='ebtn' href='/Bitsat'>BITSAT</a>
                            <a className='ebtn_n'>online test series</a>
                            <a className='ebtn_n'>online live video class</a>
                        </div>
                    </div>
                    <div>
                        <div className='ebox'>
                            <a className='ebtn'>VITEEE</a>
                            <a className='ebtn_n'>online test series</a>
                            <a className='ebtn_n'>online live video class</a>
                        </div>
                    </div>

                </div>
                <div className='eeimg'>
                    <img src={Exam_Img} className='imge' />
                </div>
            </div>
        </div>
   
  )
}

export default ExploreExam