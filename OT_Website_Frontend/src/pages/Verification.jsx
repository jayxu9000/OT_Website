import React from 'react';
import { useNavigate } from 'react-router-dom'; 

function Verification() {

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/settings');
    };
    
    return (
        <div className="verification">
            <h3>You have made successfully made an account!</h3>
            <p>Please wait for your account to be fully verified by an eboard member. You can upload your profile picture and LinkedIn profile link while you wait.</p>
            <button onClick={handleButtonClick}>I understand.</button>
        </div>
    )
}

export default Verification;
