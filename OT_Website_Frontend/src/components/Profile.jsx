import React from "react";
import linkedInLogo from "../assets/brotherhoodPhotos/linkedInLogo.png"

function Profile({ firstName, lastName, img, linkedIn }) {

    return (
        <div className="Profile">
            <img src={img} alt="img" />
            <span>{firstName} {lastName}</span>
            <div className="refs">
                <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                    <img src={linkedInLogo} alt="linkedIn" />
                </a>
            </div>
           
        </div>
    )
}

export default Profile