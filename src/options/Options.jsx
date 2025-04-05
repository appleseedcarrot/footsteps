import React, { useState, useEffect } from 'react'
import './Options.css'

export const Options = () => {
  const [blocklist, setBlocklist] = useState([])
  const [siteInput, setSiteInput] = useState('')
  const [inputError, setInputError] = useState('')

  // gets the blocklist
  useEffect(() => {
    chrome.storage.sync.get({ blocklist: [] }, ({ blocklist }) => {
      setBlocklist(blocklist)
    })
  }, [])

  // add a site to blocklist
  const addSite = () => {
    const trimmed = siteInput.trim()
    
    if (!trimmed) {
      setInputError('Please enter a URL')
      return
    }
    
    if (blocklist.includes(trimmed)) {
      setInputError('This site is already blocked')
      return
    }

    const updatedList = [...blocklist, trimmed]
    chrome.storage.sync.set({ blocklist: updatedList }, () => {
      setBlocklist(updatedList)
      setSiteInput('')
      setInputError('')
    })
  }

  // remove a site from blocklist
  const removeSite = (site) => {
    const updatedList = blocklist.filter((s) => s !== site)
    chrome.storage.sync.set({ blocklist: updatedList }, () => {
      setBlocklist(updatedList)
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSite()
    }
  }

  return (
    <main>
      <div className="header">
        <h3>Website Blocklist</h3>
        <p className="subtitle">
          During a productivity session, your activity will be monitored. <b>Warning</b>: 
          If you linger too long on a blocked site, there will be consequences...
        </p>
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={siteInput}
          onChange={(e) => {
            setSiteInput(e.target.value)
            setInputError('')
          }}
          onKeyDown={handleKeyPress}
          placeholder="Enter website URL (e.g., https://youtube.com)"
          className="site-input"
        />
        <button onClick={addSite} className="add-button">
          Add to Blocklist
        </button>
      </div>
      
      {inputError && <div className="error-message">{inputError}</div>}
      
      {blocklist.length > 0 ? (
        <div className="blocklist-container">
          <h4>Blocked Websites ({blocklist.length})</h4>
          <ul className="blocklist">
            {blocklist.map((site, index) => (
              <li key={index} className="blocklist-item">
                <span className="site-url">{site}</span>
                <button 
                  onClick={() => removeSite(site)} 
                  className="remove-button"
                  title="Remove from blocklist"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty-state">
          <p>No websites blocked yet. Add some to get started!</p>
        </div>
      )}
    </main>
  )
}

export default Options