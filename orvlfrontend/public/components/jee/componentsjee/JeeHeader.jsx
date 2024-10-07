import React from 'react'
import { IoMdHome } from "react-icons/io";
import Logo_img from '../images/image.png'
import '../stylesjee/Jeeheader.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../images/JEE MAINS AND ADVANCED BANNER.5b6025227d6c96d1bbc3.jpg'
import banner2 from '../images/JEE ADVANCED MATHEMATICS WEB BANNER 1.97dcff1bd19ee3dd03f6.jpg'

const JeeHeader = () => {
  return (
    <div>
        <div className='headerjeem'>
        <div className='headerjee'>
    <img src = {Logo_img} />
    
    </div>
        <a className='jeeanchor' href='/Home'>
        <IoMdHome /> Home
        </a>
  </div>

    <div className='divbox'>
      <h1 className='jeeh1'>
      JEE (MAINS & ADVANCED) EXAM
      </h1>
    </div>
    <Carousel className='coro'
     autoPlay={true}              
     autoPlaySpeed={3000}     
     infinite={true}
     infiniteLoop={true}
     
     >
      <div className='slide'>
        <img src={banner1}/>
      </div>
      <div className='slide'>
      <img src={banner2}/>
      </div>
    </Carousel>
    </div>
  )
}

export default JeeHeader