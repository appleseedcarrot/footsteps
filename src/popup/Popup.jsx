import { useState, useEffect } from 'react';
import ToggleSwitch from '../toggleSwitch/ToggleSwitch'
import './Popup.css'

export const Popup = () => {

  return (
    <main>
      <h1>You should be studying...</h1>
      <ToggleSwitch />
    </main>
  );
}

export default Popup;
