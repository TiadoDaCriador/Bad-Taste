import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getPhotoProjects, getPhotoProjectPhotos } from '../admin/photoProjectsData';
import ContactsFooter from '../components/ContactsFooter';
import Navbar from '../components/Navbar';

function PhotoCard({ project, index, total, photoCount }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const padded = String(index + 1).padStart(2, '0')
  const paddedTotal = String(total).padStart(2, '0')

  return (
    <div
      data-photo-card
      onClick={() => navigate(`/fotos/${project.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
        cursor: 'crosshair',
        background: '#0a0a0a',
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
          [data-photo-card] { aspect-ratio: 4/3 !important; }
        }
      `}</style>

      <Navbar theme="dark" variant="sticky" activeItem="photos" showBack onBack={handleBack} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        background: '#1a1a1a',
        flex: 1,
      }}>
        {projects.map((project, i) => (
          <PhotoCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            photoCount={photoCounts[project.slug] || 0}
          />
        ))}
      </div>

      <ContactsFooter />
    </div>
  )
}
