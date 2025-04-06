import React, { useState } from 'react';
import './ToggleSwitch.css'

const ToggleSwitch = () => {
    const [isToggled, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!isToggled);
    };
    
    return (
        <button onClick={handleToggle}>
            {isToggled ? 'ON' : 'OFF'}
        </button> 
    );
};

export default ToggleSwitch;
