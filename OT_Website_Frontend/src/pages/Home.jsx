import React from 'react';
import UB from '../assets/homePhotos/UB.jpg'
import Logo from '../assets/homePhotos/customLogo.png'
import purposeImage from '../assets/homePhotos/purposeImage.png'
import mottoImage from '../assets/homePhotos/mottoImage.jpg'


function Home() {
  return (

    <div className="home">

      <div className='top' >
        <img className='UB' src={UB} alt='UB' />
        <h1>Theta Tau</h1>
        <img className='Logo' src={Logo} alt='Logo' />
        <h2>Mu Gamma Chapter | University At Buffalo</h2>
      </div>

      <div className='purposeSection'>
        <img src={purposeImage} alt='purposeImage' />

        <div className='purpose'>
          <h2>Our purpose</h2>
          <p>The purpose of Theta Tau is to develop and maintain a high standard of professional interest among its members, and to unite them in a strong bond of fraternal fellowship.</p>
        </div>
          
      </div>

      <div className='mottoSection'>
        
        <div className='motto'>
          <h2>Our motto</h2>
          <p>"Whatsoever thy hand findeth to do, do it with thy might;..." ~Eclesiastes 9:10</p>
        </div> 
        
        <img src={mottoImage} alt='mottoImage' />
        
      </div>
               
    </div>
  )
}

export default Home;