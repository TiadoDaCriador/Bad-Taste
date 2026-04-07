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
import VideoPage from './pages/VideoPage'
import PhotosPage from './pages/PhotosPage'
import GalleryPage from './pages/GalleryPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProjectEditor from './pages/admin/AdminProjectEditor'
import { LanguageProvider } from './i18n/LanguageContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projeto/:slug" element={<ProjectPage />} />
          <Route path="/contactos" element={<ContactsPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/fotos" element={<PhotosPage />} />
          <Route path="/fotos/galeria" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects/:slug" element={<AdminProjectEditor />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
)
