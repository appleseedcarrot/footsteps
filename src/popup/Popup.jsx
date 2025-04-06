import { useState, useEffect, useContext } from 'react'
import { useUser } from '@/contexts/userContext';

import './Popup.css'

export const Popup = () => {
  const { user, isLoading } = useUser();

  if (!user) {
    return <div> No User </div>;
  }

  return (
    <main>
      <div> Logged in </div>
    </main>
  )
}

export default Popup
