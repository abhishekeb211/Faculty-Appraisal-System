import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { validateAndHandleEnvironment } from './utils/envValidation'

// Validate environment variables on startup
validateAndHandleEnvironment()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

