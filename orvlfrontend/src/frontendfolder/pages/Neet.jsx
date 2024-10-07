import React from 'react'
import NeetHeader from '../components/neet/components/NeetHeader'
import NeetFaq from '../components/neet/components/NeetFaq'
import NeetExplore from '../components/neet/components/NeetExplore'
import Footer from '../components/landingpage/footer/Footer'
import '../components/neet/styles/NeetExplore.css'

const Neet = () => {
  return (
    <div><NeetHeader/>
    <NeetFaq/>
    <NeetExplore/>
    <Footer className='footerneet'/></div>
  )
}

export default Neet