import React from 'react'
import img1 from '../images/jeemains.webp'
import img2 from '../images/jeeadvance.jpg'
import img3 from '../images/neet.webp'
import img4 from '../images/OIP.jpg'
import img5 from '../images/VITEEE-780x400.jpg'

import '../styles/Downloadmain.css'
const Downloadmain = () => {
  return (
    <div className='dowmlmain'>
        <div className="downh1">
            <h1>UG Exams</h1>
        </div>
        <div className="maindownbox">
            <div className="submainbox">
                <div className='downbox'>
                    <div className='h2downbox'>
                        <h2>JEE MAINS</h2>
                    </div>
                    <div className='downboximg'>
                        <img src={img1}/>
                    </div>
                    <div className='downexplore'>
                        <a href="/JEEMainsDownload">Explore</a>
                    </div>

                </div>
                <div className='downbox'>
                    <div className='h2downbox'>
                        <h2>JEE ADVANCE</h2>
                    </div>
                    <div className='downboximg'>
                        <img src={img2}/>
                    </div>
                    <div className='downexplore'>
                        <a href="/JEEAdvanceDownload">Explore</a>
                    </div>

                </div>
                <div className='downbox'>
                    <div className='h2downbox'>
                        <h2>NEET</h2>
                    </div>
                    <div className='downboximg'>
                        <img src={img3}/>
                    </div>
                    <div className='downexplore'>
                        <a href="">Explore</a>
                    </div>

                </div>
                <div className='downbox'>
                    <div className='h2downbox'>
                        <h2>BITSAT</h2>
                    </div>
                    <div className='downboximg'>
                        <img src={img4}/>
                    </div>
                    <div className='downexplore'>
                        <a href="">Explore</a>
                    </div>

                </div>
                <div className='downbox'>
                    <div className='h2downbox'>
                        <h2>VITEEE</h2>
                    </div>
                    <div className='downboximg'>
                        <img src={img5}/>
                    </div>
                    <div className='downexplore'>
                        <a href="">Explore</a>
                    </div>

                </div>
            </div>
        </div>

    </div>
  )
}

export default Downloadmain