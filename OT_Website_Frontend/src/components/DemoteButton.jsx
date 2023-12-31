import React from 'react';
import { useAuth } from '../components/AuthContext';

function DemoteButton() {
    const { authData } = useAuth();

    const handleDemoteClick = async () => {
        try {
            const response = await fetch(`https://ec2-18-117-157-65.us-east-2.compute.amazonaws.com:5000/users/demoteFromAdmin/${authData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authorization headers or cookies if needed
                }
            });

            if (response.ok) {
                const result = await response.json();
                window.location.reload();
                alert(result.message); // Or handle this in a more user-friendly way
                // Update the local user state if needed
            } else {
                // Handle any errors that occurred during the fetch
                console.error('Failed to demote user:', response.statusText);
            }
        } catch (error) {
            console.error('Error demoting user:', error);
        }
    };

    return (
        <div className='demoteButton'>
            <p>No longer an Eboard member? Demote yourself here:</p>
            <button onClick={handleDemoteClick}>Demote from Eboard</button>
        </div>
        
    );
}

export default DemoteButton;