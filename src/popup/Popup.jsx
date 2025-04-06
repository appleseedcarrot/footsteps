import { useState, useEffect } from 'react';
import ToggleSwitch from '../toggleSwitch/ToggleSwitch'
import './Popup.css'

export const Popup = () => {

  return (
    <main>
      <button className="settings"></button>
      <h3>SNITCH</h3>
      <div className="calc">
        <ToggleSwitch />
      </div>
    </main>
  );
}

export default Popup;
