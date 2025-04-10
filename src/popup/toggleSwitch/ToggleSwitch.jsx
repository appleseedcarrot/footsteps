import React, { useState } from 'react';
import './ToggleSwitch.css'

const ToggleSwitch = () => {
    const [isToggled, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!isToggled);
    };
    
    return (
        <div className="toggle-switch-container">
            <button
                className={`toggle-option ${isToggled ? 'active' : ''}`}
                onClick={() => setToggle(true)}
            >
                ON
            </button>
            <button
                className={`toggle-option ${!isToggled ? 'active' : ''}`}
                onClick={() => setToggle(false)}
            >
                OFF
            </button>
        </div>
    );
};

export default ToggleSwitch;
