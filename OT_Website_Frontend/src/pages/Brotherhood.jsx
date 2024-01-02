import React, { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import blankProfile from '../assets/brotherhoodPhotos/blankProfile.jpg';
import LoadingSpinner from '../components/LoadingSpinner'; // Import a loading spinner component

function Brotherhood() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch(`${apiUrl}/users/Profile`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const profileData = await response.json();

        // Fetch and attach images to each user profile
        const profilesWithImages = await Promise.all(
          profileData.map(async (profile) => {
            if (profile.image) {
              const imageResponse = await fetch(`${apiUrl}/users/Profile/image/${profile._id}`);
              if (imageResponse.ok) {
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                profile.image = imageUrl;
              }
            }
            return profile;
          })
        );

        const verifiedProfiles = profilesWithImages.filter(profile => profile.verified);
        setProfiles(verifiedProfiles);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setIsLoading(false); // Stop loading
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
