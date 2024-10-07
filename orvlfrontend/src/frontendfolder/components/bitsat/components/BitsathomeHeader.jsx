import React from 'react'
import '../styles/BitsathomeHeader.css'
import { Carousel } from 'react-responsive-carousel';
import { IoMdHome } from "react-icons/io";
import Logo_img from '../images/logo.png'
import banner1 from '../images/banner2.jpg'
import banner2 from '../images/banner1.jpg'
const BitsathomeHeader = () => {
  return (
    <div className='bitsatheader'>
        <div className='headerjeem headerneet'>
    <div className='headerjee'>
<img src = {Logo_img} />

</div>
    <a className='jeeanchor' href='/Home'>
    <IoMdHome /> Home
    </a>
</div>

<div className='divbox bitsatbox'>
  <h1 className='jeeh1 bitsath1'>
  BITSAT EXAM
  </h1>
</div>
<Carousel className='coro'
 autoPlay={true}              
 autoPlaySpeed={3000}     
 infinite={true}
 infiniteLoop={true}
 
 >
  <div className='slide'>
    <img src={banner2}/>
  </div>
  <div className='slide'>
  <img src={banner1}/>
  </div>
</Carousel>


    </div>
  )
}

export default BitsathomeHeader