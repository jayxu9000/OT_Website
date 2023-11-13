import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';

function Settings() {
    const { authData, login } = useAuth(); 
    const [linkedInURL, setlinkedInURL] = useState('');
    const [image, setImage] = useState(null);
    const [updateStatus, setUpdateStatus] = useState('');

    const updateUserLinkedIn = async (e) => {
        e.preventDefault(); 

        const updatedData = {
            linkedIn: linkedInURL
        };

        try {
            const response = await fetch(`http://localhost:5000/users/linkedIn/${authData.username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('LinkedIn updated', data);
                setUpdateStatus('LinkedIn URL updated successfully.');
                login({...authData, linkedIn: linkedInURL })
            } else {
                console.error('LinkedIn update failed:', data.message);
                setUpdateStatus('Failed to update LinkedIn URL.');
            }
        } catch (error) {
            console.error('There was an error with the update request:', error);
            setUpdateStatus('An error occurred during the update. Please try again later.');
        }
    };

    const updateUserImage = async (e) => {
        e.preventDefault(); 

        const formData = new FormData();
        if (image) {
            formData.append('image', image); // The name 'image' should match the key expected on the server side
        }

        try {
            const response = await fetch(`http://localhost:5000/users/image/${authData.username}`, {
                method: 'PUT',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Image updated', data);
                setUpdateStatus('Image updated successfully.');
                login({...authData, image: URL.createObjectURL(image) })
            } else {
                console.error('Image update failed:', data.message);
                setUpdateStatus('Failed to update Image.');
            }
        } catch (error) {
            console.error('There was an error with the update request:', error);
            setUpdateStatus('An error occurred during the update. Please try again later.');
        }
    };

    const handleImageChange = (e) => {
        // Access the file from the event object
        const file = e.target.files[0];
        if (file) {
          setImage(file);
        }
      };

    return (
        <div>
            <h3>Settings:</h3>
            <h4>{authData.name}</h4>
            <p>Current LinkedIn: {authData.linkedIn}</p>
            <form onSubmit={updateUserLinkedIn}>
                <input
                    type="url"
                    placeholder="Enter your LinkedIn URL"
                    value={linkedInURL}
                    onChange={(e) => setlinkedInURL(e.target.value)}
                    required
                />
                <button type="submit">Update LinkedIn</button>
            </form>
            <p>Current Image: {authData.image}</p>
            <form onSubmit={updateUserImage}>
                <input
                    type="file"
                    placeholder="Select your file"
                    onChange={handleImageChange}
                    required
                />
                <button type="submit">Update Image</button>
            </form>
            {updateStatus && <p>{updateStatus}</p>}
        </div>
    );
};

export default Settings;
