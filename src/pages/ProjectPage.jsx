import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'

export default function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = projects.find(p => p.slug === slug)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Fade in on mount
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
        <p style={{ letterSpacing: '0.1em', color: '#888', fontSize: '12px' }}>PROJECTO NÃO ENCONTRADO</p>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'crosshair', fontSize: '12px', letterSpacing: '0.1em', color: '#888', borderBottom: '1px solid #888', paddingBottom: '2px' }}
        >
          ← VOLTAR
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
          top: '1.5rem',
          left: '1.75rem',
          background: 'none',
          border: 'none',
          cursor: 'crosshair',
          fontSize: '11px',
          fontFamily: 'inherit',
          letterSpacing: '0.12em',
          color: '#111',
          zIndex: 10,
          padding: 0,
        }}
      >
        ← VOLTAR
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
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '55vh',
          background: '#e0deda',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: '#999',
        }}>
          VÍDEO EM BREVE
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '4rem 6rem', maxWidth: '900px' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: '700',
          letterSpacing: '0.04em',
          lineHeight: 1,
          marginBottom: '2rem',
        }}>
          {project.title.toUpperCase()}
        </h1>

        <p style={{
          fontSize: '1rem',
          lineHeight: 1.85,
          color: '#444',
          marginBottom: '2.5rem',
          maxWidth: '600px',
          fontWeight: '300',
        }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '10px',
                border: '1px solid #111',
                color: '#111',
                padding: '4px 10px',
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
