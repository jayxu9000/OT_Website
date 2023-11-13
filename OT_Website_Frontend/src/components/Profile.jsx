import React from "react";
import linkedInLogo from "../assets/brotherhoodPhotos/linkedInLogo.png"

function Profile({ img, name, linkedIn }) {

    return (
        <div className="Profile">
            <img src={img} alt="img" />
            <span>{name}</span>
            <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                <img src={linkedInLogo} alt="linkedIn" />
            </a>
        </div>
    )
}

export default Profile