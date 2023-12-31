import React, { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import blankProfile from '../assets/brotherhoodPhotos/blankProfile.jpg';

function Brotherhood() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('https://ec2-18-117-157-65.us-east-2.compute.amazonaws.com:5000/users/Profile');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const profileData = await response.json();

        // Fetch and attach images to each user profile
        const profilesWithImages = await Promise.all(
          profileData.map(async (profile) => {
            if (profile.image) {
              const imageResponse = await fetch(`https://ec2-18-117-157-65.us-east-2.compute.amazonaws.com:5000/users/Profile/image/${profile._id}`);
              if (imageResponse.ok) {
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                profile.image = imageUrl;
              }
            }
            return profile;
          })
        );

        const verifiedProfiles = profilesWithImages.filter(profiles => profiles.verified);
        setProfiles(verifiedProfiles);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Call the function
    fetchProfiles();
  }, []);

  return (
    <div className='Brothers'>
      <h2>Brothers:</h2>
      <div className='brotherList'>
        {profiles.map((profile) => (
          <Profile key={profile._id} firstName={profile.firstName} lastName={profile.lastName} img={profile.image || blankProfile} linkedIn={profile.linkedIn} />
        ))}
      </div>
    </div>
  );
}

export default Brotherhood;
