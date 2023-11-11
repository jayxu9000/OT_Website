import React from "react";

function Profile({ props }) {

    const handleClick = () => {

    }

    return (
        <div>
            <div onClick={handleClick}>
                <img src={props.img} alt="img" />
                <Text>Lana Kim</Text>
            </div>
            {showPopup && <Popup content={props.description} handleClose={handleClose} />}
        </div>
    )
}

export default Profile