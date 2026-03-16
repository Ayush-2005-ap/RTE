import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '12px',
            background: '#1A2744',
            color: '#fff',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#C62828', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
