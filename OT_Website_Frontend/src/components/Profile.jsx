import React from "react";
import linkedInLogo from "../assets/brotherhoodPhotos/linkedInLogo.png";
import resumeLogo from "../assets/brotherhoodPhotos/resumeLogo.png";

function Profile({ firstName, lastName, img, linkedIn, resume }) {

    const openResumePopup = (base64String, event) => {
        event.preventDefault();  // Prevent the default anchor behavior

        if (!base64String) return; // Do nothing if no resume data

        const popupWindow = window.open('', '_blank', 'width=800,height=600');
        const iframe = popupWindow.document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = base64String;
        popupWindow.document.body.appendChild(iframe);
    };

    return (
        <div className="Profile">
            <img src={img} alt="Profile" />
            <span>{firstName} {lastName}</span>
            <div className="refs">
                <a className={!linkedIn ? 'inactiveLinkedIn' : 'linkedIn'} href={linkedIn} target="_blank" rel="noopener noreferrer">
                    <img src={linkedInLogo} alt="LinkedIn" />
                </a>
                <a href={resume || '#'} 
                   onClick={(e) => openResumePopup(resume, e)} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className={!resume ? 'inactiveResume' : 'resume'}>
                    <img src={resumeLogo} alt="Resume" />
                </a>
            </div>
        </div>
    );
}

export default Profile;
