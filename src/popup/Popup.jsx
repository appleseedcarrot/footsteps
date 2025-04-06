import { useState, useEffect, useContext } from 'react';
import ToggleSwitch from '../toggleSwitch/ToggleSwitch';
import { useUser } from '@/contexts/userContext';

import './Popup.css'

export const Popup = () => {
  const { user, isLoading } = useUser();

  if (!user) {
    return <div> No User </div>;
  }

  return (
    <main>
      <h1>You should be studying...</h1>
      <ToggleSwitch />
    </main>
  );
}

export default Popup;
