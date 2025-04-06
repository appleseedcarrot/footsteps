import React from 'react'
import ReactDOM from 'react-dom/client'
import { Popup } from './Popup'
import './index.css'
import { UserProvider } from '../contexts/userContext'

ReactDOM.createRoot(document.getElementById('app')).render(
  <UserProvider>
    <Popup />
  </UserProvider>
)
