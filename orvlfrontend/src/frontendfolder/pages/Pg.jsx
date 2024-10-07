import React from 'react'
import Explore from '../components/pg/COMPO/Explore'
import Footer from '../components/landingpage/footer/Footer'
import Course from '../components/pg/COMPO/Course'
import Pgheader from '../components/pg/COMPO/Pgheader'


const Pg = () => {
  return (
    <div>
        <Pgheader />
        <Explore />
        <Course />
        <Footer />

    </div>
  )
}

export default Pg