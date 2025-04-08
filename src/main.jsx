import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import ImageUploader from './components/ImageUploader'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageUploader />
  </StrictMode>,
)
