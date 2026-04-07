import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getProjects } from '../admin/adminData'
const projects = getProjects()
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext'

function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage()

  return (
    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
      {LANGUAGES.map((l, i) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => changeLanguage(l)}
            style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: '#111',
              background: 'none',
              border: 'none',
              cursor: 'crosshair',
              padding: 0,
              opacity: lang === l ? 1 : 0.35,
              transition: 'opacity 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (lang !== l) e.currentTarget.style.opacity = '0.65' }}
            onMouseLeave={e => { if (lang !== l) e.currentTarget.style.opacity = '0.35' }}
          >
            {l.toUpperCase()}
          </button>
          {i < LANGUAGES.length - 1 && (
            <span style={{ fontSize: '10px', color: '#111', opacity: 0.2 }}>|</span>
          )}
        </span>
      ))}
    </div>
  )
}

function VideoCard({ project, index, total, t, isLast, isOdd }) {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const localized = t.projects[project.slug] || {}
  const title = localized.title || project.title
  const tags = localized.tags || project.tags

  const handleMouseEnter = () => {
    setHovered(true)
    if (videoRef.current) {
      videoRef.current.currentTime = project.previewStart || 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const padded = String(index + 1).padStart(2, '0')
  const paddedTotal = String(total).padStart(2, '0')

  return (
    <div
      onClick={() => navigate(`/projeto/${project.slug}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        aspectRatio: isLast && isOdd ? '32/9' : '16/9',
        overflow: 'hidden',
        cursor: 'crosshair',
        background: '#111',
        gridColumn: isLast && isOdd ? 'span 2' : 'auto',
        borderTop: '1px solid rgba(17,17,17,0.12)',
        borderRight: !isLast || !isOdd ? '1px solid rgba(17,17,17,0.12)' : 'none',
      }}
    >
      {/* Thumbnail */}
      {project.thumbnail && (
        <img
          src={project.thumbnail}
          alt={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}

      {/* No thumbnail fallback */}
      {!project.thumbnail && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#1a1a1a',
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }} />
      )}

      {/* Video */}
      {project.videoFull && (
        <video
          ref={videoRef}
          src={project.videoFull}
          muted
          playsInline
          loop
          preload="metadata"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* Info */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        <div>
          <p style={{
            fontSize: '9px',
            color: '#eeece8',
            opacity: 0.45,
            letterSpacing: '0.2em',
            marginBottom: '0.35rem',
            fontWeight: '600',
          }}>
            {padded} / {paddedTotal}
          </p>
          <h2 style={{
            fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)',
            fontWeight: '700',
            color: '#eeece8',
            letterSpacing: '0.08em',
            margin: 0,
          }}>
            {title.toUpperCase()}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '40%' }}>
          {tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontSize: '9px',
              border: '1px solid rgba(238,236,232,0.35)',
              color: '#eeece8',
              padding: '3px 9px',
              letterSpacing: '0.1em',
              fontWeight: '600',
            }}>
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function VideoPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)
  const isOdd = projects.length % 2 !== 0

  useEffect(() => {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#eeece8',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      fontFamily: 'Space Grotesk, sans-serif',
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        zIndex: 100,
        background: '#eeece8',
        borderBottom: '1px solid rgba(17,17,17,0.1)',
      }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            cursor: 'crosshair',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Bad Taste">
            <rect width="36" height="36" fill="#111"/>
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#eeece8">BT</text>
          </svg>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.12em', color: '#111' }}>
            BAD TASTE
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.15em',
            color: '#111',
            borderBottom: '1px solid #111',
            paddingBottom: '1px',
          }}>
            VIDEO
          </span>

          <Link
            to="/contactos"
            style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: '#111',
              opacity: 0.55,
              textDecoration: 'none',
              cursor: 'crosshair',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.55'}
          >
            {t.nav.contacts}
          </Link>

          <div style={{ width: '1px', height: '12px', background: '#111', opacity: 0.2 }} />
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        borderBottom: '1px solid rgba(17,17,17,0.12)',
      }}>
        {projects.map((project, i) => (
          <VideoCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            t={t}
            isLast={i === projects.length - 1}
            isOdd={isOdd}
          />
        ))}
      </div>
    </div>
  )
}
