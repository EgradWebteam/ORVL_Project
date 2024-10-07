import React from 'react'
import { IoMdHome } from "react-icons/io";
import Logo_img from '../images/logo.png';
import '../styles/Downloadmain.css'
import jeemain from '../images/jeemains11.png'
import jeeadvance from '../images/jeeadvance11.png'
import neet from '../images/neet11.png'
import aps from '../images/aps.png'
import tsc from '../images/ts.png'
import kin from '../images/kset.png'
import mh from '../images/mh.png'
import wehee from '../images/wejee.png'
import bar from '../images/bar.png'
import add from '../images/add.png'
const Ugdownloadhome = () => {
  return (
    <div>
          <div className='headerjeedm'>
        <div className='headerjeed'>
          <img src={Logo_img} alt="Logo" />
        </div>
        <a className='jeeanchoring' href='/Home'>
          <IoMdHome /> Home
        </a>
      </div>
      
      <div className='divboxmain111'>
        <h1 className='h1downmain'>
            UG EXAMS
        </h1>
      </div>
      <div className='content-container'>
      <div className='grid-CONTAINER'>
        <div className='item'>
            <div className='imageitem'>
                <img src={jeemain} />
            </div>
        
            <div className='textimgbtn'>
                <div className='imgtxt'>
                   <a href="/JEEMainsDownload"> <img src={bar}/>
                    <h2>JEE MAINS</h2>
                    
                    </a>
                </div>
            </div>
        </div>
        <div className='item'>
            <div className='imageitem'>
                <img src={jeeadvance} />
            </div>
            <div className='textimgbtn'>
                <div className='imgtxt'>
                <a href="/JEEAdvanceDownload"> <img src={bar}/>
                    <h2>JEE (ADVANCE)</h2>
                    </a>
                </div>
            </div>
        </div>
        <div className='item'>
            <div className='imageitem'>
                <img src={neet} />
            </div>
            <div className='textimgbtn'>
                <div className='imgtxt'>
                <a href="/Downloadneet"> <img src={bar}/>
                    <h2 className='wer'>NEET</h2>
                    </a>
                </div>
               
            </div>
        </div>
        <div className='item'>
            <div className='imageitem'>
                <img src={aps} />
            </div>
            <div className='textimgbtn'>
                <div className='imgtxt'>
                <a href=""> <img src={bar}/>
                    <h2>AP-EAPSET</h2>
                    </a>
                </div>
            </div>
        </div>
        <div className='item'>
            <div className='imageitem'>
                <img src={tsc} />
            </div>
            <div className='textimgbtn'>
                <div className='imgtxt'>
                <a href="">
                    <img src={bar}/>
                    <h2>TS-EAMSET</h2>
                    </a>
                </div>
            </div>
        </div>
        <div className='item'>
            <div className='imageitem'>
                <img src={kin} />
            </div>
            <div className='textimgbtn'>
                <div className='imgtxt'>
                    <a href="">
                    <img src={bar}/>
                    <h2 className='wer'>KCET</h2>
                    </a>
                </div>
            </div>
        </div>
        <div className='item'>
            <div className='imageitem'>
                <img src={mh} />
            </div>
            <div className='textimgbtn'>
                <div className='imgtxt'>
                <a href="">
                    <img src={bar}/>
                    <h2>MHCET</h2>
                    </a>
                </div>
            </div>
        </div>
        <div className='item'>
            <div className='imageitem'>
                <img src={wehee} />
            </div>
            <div className='textimgbtn'>
            <div className='imgtxt'>
            <a href="">
                    <img src={bar}/>
                    <h2 className='ebjee'>WBJEE</h2>
            </a>
                </div>
                </div>
            </div>
        </div>
      </div>
      </div>
   
  )
}

export default Ugdownloadhome