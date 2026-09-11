
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ImageKitProvider } from '@imagekit/react'
import './index.css'
import App from './App.jsx'
import { DataProvider } from './context/DataContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/JeetuRajput">
      <DataProvider>
        <App />
      </DataProvider>
    </ImageKitProvider>
  </StrictMode>,
)

