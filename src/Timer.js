// Timer.js
// help from: https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9

import React from 'react';
import { useState } from 'react';

const Timer = () => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    return (
        <dim className="timer">

        </dim>
    );
};

export default Timer;