import React, { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import blankProfile from '../assets/brotherhoodPhotos/blankProfile.jpg'

function Brotherhood() {
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/Profile'); // Adjust the URL based on your server setup
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const profileData = await response.json();
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Call the function
    fetchProfile();
  }, []);

  return (
    <div className='Brothers'>
      <h3>Brothers:</h3>
      <div className='brotherList'>
        {profile.map(profile => <Profile key={profile._id} name={profile.name} img={profile.image || blankProfile} linkedIn={profile.linkedIn} />)}
      </div>
    </div>
  );
}

export default Brotherhood;
