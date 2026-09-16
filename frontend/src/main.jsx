
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ImageKitProvider } from '@imagekit/react'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import { DataProvider } from './context/DataContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/JeetuRajput">
      <Provider store={store}>
        <DataProvider><App /></DataProvider>
      </Provider>
    </ImageKitProvider>
  </StrictMode>,
)

