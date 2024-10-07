import React from 'react'
import JeeolvHeader from '../components/jee/componentsjee/JeeolvHeader'
import Footer from '../components/landingpage/footer/Footer'
import { LuArrowUpToLine } from "react-icons/lu";
import '../components/jee/stylesjee/JeeolvHeader.css'

const Jeeolv = () => {
  return (
    <div><JeeolvHeader id='top'/>
    <Footer/>
    <span className='uptotop'>
      <a href="#top"><LuArrowUpToLine /></a>
    </span>
    </div>
  )
}

export default Jeeolv