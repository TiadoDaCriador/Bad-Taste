import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProjects } from '../admin/adminData'
const projects = getProjects()
import { useLanguage } from '../i18n/LanguageContext'

export default function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = projects.find(p => p.slug === slug)
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()

  const localized = t.projects[slug] || {}
  const title = localized.title || project?.title || ''
  const description = localized.description || project?.description || ''
  const tags = localized.tags || project?.tags || []

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') goBack()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const goBack = () => {
    setVisible(false)
    setTimeout(() => navigate('/', { state: { fromSlug: slug } }), 250)
  }

  if (!project) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ letterSpacing: '0.1em', color: '#888', fontSize: '12px' }}>{t.project.notFound}</p>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'crosshair', fontSize: '12px', letterSpacing: '0.1em', color: '#888', borderBottom: '1px solid #888', paddingBottom: '2px' }}
        >
          {t.project.back}
        </button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      overflowY: 'auto',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      {/* Back button */}
      <button
        onClick={goBack}
        style={{
          position: 'fixed',
          top: 'clamp(1rem, 2vw, 1.5rem)',
          left: 'clamp(1rem, 3vw, 1.75rem)',
          background: 'none',
          border: 'none',
          cursor: 'crosshair',
          fontSize: 'clamp(10px, 1.2vw, 11px)',
          fontFamily: 'inherit',
          letterSpacing: '0.12em',
          color: '#111',
          zIndex: 10,
          padding: 0,
        }}
      >
        {t.project.back}
      </button>

      {/* Video full-width */}
      {project.videoFull ? (
        <video
          src={project.videoFull}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            maxHeight: '70vh',
            minHeight: 'clamp(250px, 50vh, 70vh)',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          minHeight: 'clamp(250px, 50vh, 55vh)',
          background: '#e0deda',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(10px, 1.2vw, 11px)',
          letterSpacing: '0.1em',
          color: '#999',
        }}>
          {t.project.videoSoon}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: 'clamp(2rem, 4vw, 4rem) clamp(1rem, 3vw, 6rem)', maxWidth: '900px' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 5rem)',
          fontWeight: '700',
          letterSpacing: '0.04em',
          lineHeight: 1,
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
        }}>
          {title.toUpperCase()}
        </h1>

        <p style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
          lineHeight: 1.85,
          color: '#444',
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
          maxWidth: '600px',
          fontWeight: '300',
        }}>
          {description}
        </p>

        <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 8px)', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: 'clamp(9px, 1.2vw, 10px)',
                border: '1px solid #111',
                color: '#111',
                padding: 'clamp(3px, 0.8vw, 4px) clamp(8px, 1.5vw, 10px)',
                letterSpacing: '0.1em',
              }}
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
