import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // We keep StrictMode off for drag-and-drop to behave perfectly in dev mode
  <App />
)