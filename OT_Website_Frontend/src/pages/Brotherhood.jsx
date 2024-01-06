import React, { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import blankProfile from '../assets/brotherhoodPhotos/blankProfile.jpg';
import LoadingSpinner from '../components/LoadSpinner';

function Brotherhood() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/users/Profile`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const profileData = await response.json();
        const verifiedProfiles = profileData.filter(profile => profile.verified);
        setProfiles(verifiedProfiles);
  
        // Log the image data of the first profile
        if (verifiedProfiles.length > 0) {
          console.log("First profile's image data:", verifiedProfiles[0].image);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setIsLoading(false);
    };
  
    fetchProfiles();
  }, []);
  
  
  

  return (
    <div className='Brothers'>
      <h2>Brothers:</h2>
      {isLoading ? (
        <LoadingSpinner /> // Show loading spinner when data is loading
      ) : (
        <div className='brotherList'>
          {profiles.map((profile) => (
            <Profile key={profile._id} firstName={profile.firstName} lastName={profile.lastName} img={profile.image || blankProfile} linkedIn={profile.linkedIn} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Brotherhood;
