import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { getPhotoProjects, getPhotoProjectPhotos } from '../admin/photoProjectsData'
import ContactsFooter from '../components/ContactsFooter'
import Navbar from '../components/Navbar'

export default function PhotoProjectPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const { t } = useLanguage()

  const [project, setProject] = useState(null)
  const [photos, setPhotos] = useState([])
  const [visible, setVisible] = useState(false)
  const [lightbox, setLightbox] = useState(null) // index or null

  useEffect(() => {
    async function load() {
      const [projects, projectPhotos] = await Promise.all([
        getPhotoProjects(),
        getPhotoProjectPhotos(slug),
      ])
      const found = projects.find(p => p.slug === slug)
      setProject(found || null)
      setPhotos(projectPhotos.sort((a, b) => (a.order || 0) - (b.order || 0)))
    }
    load()
    requestAnimationFrame(() => setVisible(true))
  }, [slug])

  const goBack = useCallback(() => {
    setVisible(false)
    setTimeout(() => navigate('/fotos'), 250)
  }, [navigate])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const prevPhoto = useCallback(() => {
    setLightbox(i => (i - 1 + photos.length) % photos.length)
  }, [photos.length])

  const nextPhoto = useCallback(() => {
    setLightbox(i => (i + 1) % photos.length)
  }, [photos.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (lightbox !== null) {
        if (e.key === 'Escape') closeLightbox()
        if (e.key === 'ArrowLeft') prevPhoto()
        if (e.key === 'ArrowRight') nextPhoto()
      } else {
        if (e.key === 'Escape') goBack()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [lightbox, goBack, closeLightbox, prevPhoto, nextPhoto])

  const isOdd = photos.length % 2 !== 0

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      fontFamily: 'Space Grotesk, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @media (max-width: 768px) {
          [data-photo-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar theme="dark" variant="sticky" activeItem="photos" showBack onBack={goBack} />

      {/* Project title */}
      {project && (
        <div style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.75rem)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h1 style={{
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            fontWeight: '700', letterSpacing: '0.08em',
            color: '#eeece8', margin: 0,
          }}>
            {project.title.toUpperCase()}
          </h1>
        </div>
      )}

      {/* Photos grid */}
      {photos.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 'clamp(11px, 1.5vw, 12px)', color: '#eeece8', opacity: 0.2, letterSpacing: '0.1em' }}>—</span>
        </div>
      ) : (
        <div data-photo-grid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          background: '#000',
          flex: 1,
        }}>
          {photos.map((photo, i) => (
            <PhotoGridItem
              key={photo.id}
              photo={photo}
              index={i}
              total={photos.length}
              isLast={i === photos.length - 1}
              isOdd={isOdd}
              onClick={() => setLightbox(i)}
            />
          ))}
        </div>
      )}

      <ContactsFooter />

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.93)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Counter */}
          <div style={{
            position: 'absolute', top: 'clamp(1rem, 3vw, 1.5rem)', left: 'clamp(1rem, 3vw, 1.5rem)',
            fontSize: 'clamp(9px, 1.2vw, 10px)', letterSpacing: '0.25em',
            color: '#eeece8', opacity: 0.5, fontWeight: '600',
          }}>
            {String(lightbox + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </div>

          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 'clamp(1rem, 3vw, 1.5rem)', right: 'clamp(1rem, 3vw, 1.5rem)',
              background: 'none', border: 'none', color: '#eeece8', fontSize: 'clamp(16px, 2vw, 20px)',
              cursor: 'crosshair', opacity: 0.6, fontFamily: 'inherit', padding: '0.25rem',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
          >✕</button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prevPhoto() }}
              style={{
                position: 'absolute', left: 'clamp(0.5rem, 2vw, 1.5rem)',
                background: 'none', border: 'none', color: '#eeece8',
                fontSize: 'clamp(20px, 3vw, 28px)', cursor: 'crosshair',
                opacity: 0.5, padding: '1rem', fontFamily: 'monospace',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
            >‹</button>
          )}

          {/* Image */}
          <img
            src={photos[lightbox]?.path}
            alt={photos[lightbox]?.caption}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '85vh',
              objectFit: 'contain', display: 'block',
            }}
          />

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); nextPhoto() }}
              style={{
                position: 'absolute', right: 'clamp(0.5rem, 2vw, 1.5rem)',
                background: 'none', border: 'none', color: '#eeece8',
                fontSize: 'clamp(20px, 3vw, 28px)', cursor: 'crosshair',
                opacity: 0.5, padding: '1rem', fontFamily: 'monospace',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
            >›</button>
          )}

          {/* Caption */}
          {photos[lightbox]?.caption && (
            <div style={{
              position: 'absolute', bottom: 'clamp(1rem, 3vw, 1.5rem)',
              left: '50%', transform: 'translateX(-50%)',
              fontSize: 'clamp(9px, 1.2vw, 10px)', letterSpacing: '0.15em',
              color: '#eeece8', opacity: 0.5, textAlign: 'center',
              maxWidth: '60vw',
            }}>
              {photos[lightbox].caption.toUpperCase()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PhotoGridItem({ photo, index, total, isLast, isOdd, onClick }) {
  const [hovered, setHovered] = useState(false)
  const padded = String(index + 1).padStart(2, '0')
  const paddedTotal = String(total).padStart(2, '0')

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: isLast && isOdd ? '32/9' : '16/9',
        overflow: 'hidden',
        cursor: 'crosshair',
        background: '#0a0a0a',
        gridColumn: isLast && isOdd ? 'span 2' : 'auto',
      }}
    >
      <img
        src={photo.path}
        alt={photo.caption}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          transition: 'transform 0.8s ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }}
      />
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
        gap: 'clamp(0.4rem, 1vw, 0.6rem)',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        <p style={{ fontSize: 'clamp(8px, 1vw, 9px)', color: '#eeece8', opacity: 0.5, letterSpacing: '0.3em', fontWeight: '600', margin: 0 }}>
          {padded} / {paddedTotal}
        </p>
        {photo.caption && (
          <p style={{ fontSize: 'clamp(0.8rem, 2vw, 1.1rem)', fontWeight: '600', color: '#eeece8', letterSpacing: '0.08em', margin: 0 }}>
            {photo.caption.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  )
}
