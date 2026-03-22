import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EmergencyProvider } from './context/EmergencyContext.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmergencyProvider>
      <Toaster position="top-right" toastOptions={{ className: 'glass-panel text-main font-semibold' }} />
      <App />
    </EmergencyProvider>
  </StrictMode>,
)
