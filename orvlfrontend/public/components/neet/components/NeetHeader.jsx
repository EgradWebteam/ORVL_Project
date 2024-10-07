import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../images/logo.png'
import banner1 from '../images/banner2.jpg'
import banner2 from '../images/banner1.jpg'
import '../styles/NeetHeader.css'

const NeetHeader = () => {
  return (
    <div className='hedneetmain'> 
    <div className='headerjeem headerneet'>
    <div className='headerjee'>
<img src = {Logo_img} />

</div>
    <a className='jeeanchor' href='/Home'>
    <IoMdHome /> Home
    </a>
</div>

<div className='divbox NEETBOX'>
  <h1 className='jeeh1'>
  NEET
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

export default NeetHeader