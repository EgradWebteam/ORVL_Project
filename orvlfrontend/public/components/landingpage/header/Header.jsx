import React from 'react'
import Logo_img from './Images/logo.png';
import "./header.css"
const Header = () => {
  return (
    <div className='header'>
        <img src = {Logo_img} />
    </div>
  )
}

export default Header