import React from 'react'
import ReactDOM from 'react-dom/client'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import ContactsPage from './pages/ContactsPage'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projeto/:slug" element={<ProjectPage />} />
        <Route path="/contactos" element={<ContactsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
