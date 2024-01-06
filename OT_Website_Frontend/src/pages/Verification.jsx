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
            <p>Please wait a bit for your account to be verified or contact Yuanjie for any further inquiries.</p>
            <button onClick={handleButtonClick}>I understand.</button>
        </div>
    )
}

export default Verification;
