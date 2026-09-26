import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Analytics } from '@vercel/analytics/react'
import './shaders/threeui.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
