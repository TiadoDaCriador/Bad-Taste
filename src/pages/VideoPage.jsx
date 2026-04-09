import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../admin/adminData'
import { useLanguage } from '../i18n/LanguageContext'
import ContactsFooter from '../components/ContactsFooter'
import Navbar from '../components/Navbar'

function VideoCard({ project, index, total, t }) {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const localized = t.projects[project.slug] || {}
  const title = localized.title || project.title
  const tags = localized.tags || project.tags || []

  const handleMouseEnter = () => {
    setHovered(true)
    if (videoRef.current) {
      videoRef.current.currentTime = project.previewStart || 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    if (videoRef.current) videoRef.current.pause()
  }

  const padded = String(index + 1).padStart(2, '0')
  const paddedTotal = String(total).padStart(2, '0')

  return (
    <div
      data-video-card
      onClick={() => navigate(`/projeto/${project.slug}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
        cursor: 'crosshair',
        background: '#0a0a0a',
      }}
    >
      {project.thumbnail && (
        <img
          src={project.thumbnail}
          alt={title}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        />
      )}

      {!project.thumbnail && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#181818',
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }} />
      )}

      {project.videoFull && (
        <video
          ref={videoRef}
          src={project.videoFull}
          muted
          playsInline
          loop
          preload="metadata"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: hovered ? 'rgba(0,0,0,0.52)' : 'rgba(0,0,0,0)',
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', pointerEvents: 'none',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        gap: 'clamp(0.5rem, 1.2vw, 0.8rem)',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        <p style={{
          fontSize: 'clamp(8px, 1vw, 9px)',
          color: '#eeece8', opacity: 0.5,
          letterSpacing: '0.3em', fontWeight: '600', margin: 0,
        }}>
          {padded} / {paddedTotal}
        </p>
        <h2 style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
          fontWeight: '700', color: '#eeece8',
          letterSpacing: '0.1em', margin: 0, lineHeight: 1.05,
        }}>
          {title.toUpperCase()}
        </h2>
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.3rem' }}>
            {tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: 'clamp(7px, 0.9vw, 9px)',
                color: '#eeece8', opacity: 0.6,
                letterSpacing: '0.2em', fontWeight: '500',
              }}>
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VideoPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getProjects().then(setProjects)
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setVisible(false)
        setTimeout(() => navigate('/'), 250)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleBack = () => {
    setVisible(false)
    setTimeout(() => navigate('/'), 250)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      fontFamily: 'Space Grotesk, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @media (max-width: 600px) {
          [data-video-card] { aspect-ratio: 4/3 !important; }
        }
      `}</style>

      <Navbar theme="dark" variant="sticky" activeItem="video" showBack onBack={handleBack} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        background: '#1a1a1a',
        flex: 1,
      }}>
        {projects.map((project, i) => (
          <VideoCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            t={t}
          />
        ))}
      </div>

      <ContactsFooter />
    </div>
  )
}
