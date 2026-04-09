import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext';
import { getPhotoProjects, getPhotoProjectPhotos } from '../admin/photoProjectsData';
import ContactsFooter from '../components/ContactsFooter';

function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage()
  return (
    <div style={{ display: 'flex', gap: 'clamp(0.4rem, 1vw, 0.6rem)', alignItems: 'center' }}>
      {LANGUAGES.map((l, i) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.4rem, 1vw, 0.6rem)' }}>
          <button
            onClick={() => changeLanguage(l)}
            style={{
              fontSize: 'clamp(9px, 1.2vw, 10px)', fontWeight: '600', letterSpacing: '0.15em',
              color: '#eeece8', background: 'none', border: 'none', cursor: 'crosshair', padding: 0,
              opacity: lang === l ? 1 : 0.35, transition: 'opacity 0.2s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (lang !== l) e.currentTarget.style.opacity = '0.65' }}
            onMouseLeave={e => { if (lang !== l) e.currentTarget.style.opacity = '0.35' }}
          >{l.toUpperCase()}</button>
          {i < LANGUAGES.length - 1 && (
            <span style={{ fontSize: 'clamp(9px, 1.2vw, 10px)', color: '#eeece8', opacity: 0.2 }}>|</span>
          )}
        </span>
      ))}
    </div>
  )
}

function PhotoCard({ project, index, total, isLast, isOdd, photoCount }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const padded = String(index + 1).padStart(2, '0')
  const paddedTotal = String(total).padStart(2, '0')

  return (
    <div
      onClick={() => navigate(`/fotos/${project.slug}`)}
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
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          alt={project.title}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.8s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#181818' }} />
      )}

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered ? 'rgba(0,0,0,0.52)' : 'rgba(0,0,0,0)',
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
      }} />

      {/* Info — only on hover */}
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
          {project.title.toUpperCase()}
        </h2>
        <p style={{
          fontSize: 'clamp(7px, 0.9vw, 9px)',
          color: '#eeece8', opacity: 0.6,
          letterSpacing: '0.2em', fontWeight: '500',
        }}>
          {photoCount} {photoCount === 1 ? 'FOTO' : 'FOTOS'}
        </p>
      </div>
    </div>
  )
}

export default function PhotosPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [projects, setProjects] = useState([])
  const [visible, setVisible] = useState(false)
  const [photoCounts, setPhotoCounts] = useState({})

  useEffect(() => {
    const loadProjects = async () => {
      const projs = await getPhotoProjects()
      setProjects(projs)
      // Load photo counts for each project
      const counts = {}
      for (const proj of projs) {
        const photos = await getPhotoProjectPhotos(proj.slug)
        counts[proj.slug] = photos.length
      }
      setPhotoCounts(counts)
    }
    loadProjects()
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

  const isOdd = projects.length % 2 !== 0

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
          [data-photos-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0,
        height: 'clamp(50px, 10vw, 60px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1rem, 3vw, 1.75rem)',
        zIndex: 100, background: '#111',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        gap: 'clamp(1rem, 2vw, 1.5rem)', flexWrap: 'wrap', flexShrink: 0,
      }}>
        <button
          onClick={() => { setVisible(false); setTimeout(() => navigate('/'), 250); }}
          style={{
            background: 'none', border: 'none', cursor: 'crosshair',
            fontSize: 'clamp(10px, 1.2vw, 11px)', fontFamily: 'inherit',
            letterSpacing: '0.12em', color: '#eeece8', padding: 0,
            opacity: 0.5, transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
        >
          ← {t.project?.back?.replace('← ', '') || 'VOLVER'}
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)', textDecoration: 'none', cursor: 'crosshair' }}>
          <svg width="clamp(28px, 5vw, 36px)" height="clamp(28px, 5vw, 36px)" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="#eeece8"/>
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: '700', letterSpacing: '0.12em', color: '#eeece8' }}>
            BAD TASTE
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2vw, 2.5rem)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Link
            to="/video"
            style={{
              fontSize: 'clamp(10px, 1.2vw, 11px)', fontWeight: '600',
              letterSpacing: '0.15em', color: '#eeece8', opacity: 0.45,
              textDecoration: 'none', cursor: 'crosshair', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
          >
            VIDEO
          </Link>
          <span style={{
            fontSize: 'clamp(10px, 1.2vw, 11px)', fontWeight: '700',
            letterSpacing: '0.15em', color: '#eeece8',
            borderBottom: '1px solid #eeece8', paddingBottom: '1px',
          }}>
            {t.photos?.title || 'FOTOS'}
          </span>
          <Link
            to="/contactos"
            style={{
              fontSize: 'clamp(10px, 1.2vw, 11px)', fontWeight: '600',
              letterSpacing: '0.15em', color: '#eeece8', opacity: 0.45,
              textDecoration: 'none', cursor: 'crosshair', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
          >
            {t.nav?.contacts || 'CONTACTO'}
          </Link>
          <div style={{ width: '1px', height: 'clamp(10px, 1.5vw, 12px)', background: '#eeece8', opacity: 0.15 }} />
          <LanguageSwitcher />
        </div>
      </nav>

      <div data-photos-grid style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1px',
        background: '#000',
        flex: 1,
      }}>
        {projects.map((project, i) => (
          <PhotoCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            isLast={i === projects.length - 1}
            isOdd={isOdd}
            photoCount={photoCounts[project.slug] || 0}
          />
        ))}
      </div>

      <ContactsFooter />
    </div>
  )
}
