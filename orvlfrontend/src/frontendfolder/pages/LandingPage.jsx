import React,{lazy,Suspense} from 'react'
import Header from '../components/landingpage/header/Header'
import Main from '../components/landingpage/main/Main'
import Footer from '../components/landingpage/footer/Footer'

const LandingPage = () => {
  return (
    <div>
        <Header />
        <Main />
        <Footer />
    </div>
  )
}

export default LandingPage