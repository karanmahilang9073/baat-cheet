import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { Authprovider } from './context/authContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Authprovider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </Authprovider>
    </BrowserRouter>
  </StrictMode>,
)
