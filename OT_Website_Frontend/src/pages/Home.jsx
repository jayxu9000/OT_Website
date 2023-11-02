import React from 'react';
import UB from '../assets/homePhotos/UB.jpg'
import Logo from '../assets/homePhotos/customLogo.png'

function Home() {
  return (

    <div className="home">
      <img src={UB} alt='UB' />
      <img src={Logo} alt='Logo' />
    </div>
  )
}

export default Home;