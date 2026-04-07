import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RotatingWheel from '../components/RotatingWheel'
import BackgroundSlideshow from '../components/BackgroundSlideshow'
import VideoPreview from '../components/VideoPreview'
import { projects } from '../data/projects'

const NAV_LINKS = [
  { label: 'VIDEO', to: '#' },
  { label: 'PHOTOS', to: '#' },
  { label: 'CONTACTS', to: '/contactos' },
]

function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.75rem',
      zIndex: 100,
      pointerEvents: 'none',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        pointerEvents: 'auto',
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Bad Taste">
          <rect width="36" height="36" fill="#111"/>
          <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#eeece8">BT</text>
        </svg>
        <span style={{
          fontSize: '15px',
          fontWeight: '700',
          letterSpacing: '0.12em',
          color: '#111',
        }}>BAD TASTE</span>
      </div>

      {/* Nav links */}
      <div style={{
        display: 'flex',
        gap: '2.5rem',
        pointerEvents: 'auto',
      }}>
        {NAV_LINKS.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: '#111',
              cursor: 'crosshair',
              opacity: 0.75,
              transition: 'opacity 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function ContactsSection() {
  return (
    <section
      id="contacts"
      style={{
        position: 'relative',
        zIndex: 1,
        background: '#111',
        color: '#eeece8',
        padding: '5rem 1.75rem 4rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '3rem',
        cursor: 'default',
      }}
    >
      {/* Left: brand */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" fill="#eeece8"/>
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.12em' }}>BAD TASTE</span>
        </div>
        <p style={{ fontSize: '11px', lineHeight: 1.8, opacity: 0.55, maxWidth: '220px', letterSpacing: '0.04em' }}>
          Portfólio de projetos visuais e sonoros.<br />Lisboa, Portugal.
        </p>
      </div>

      {/* Middle: links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '0.25rem' }}>
          NAVEGAÇÃO
        </p>
        {['VIDEO', 'PHOTOS', 'PROJETOS'].map(item => (
          <a
            key={item}
            href="#"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              opacity: 0.65,
              cursor: 'crosshair',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.65'}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Right: contacts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '0.25rem' }}>
          CONTACTO
        </p>
        {[
          { label: 'hello@badtaste.pt', href: 'mailto:hello@badtaste.pt' },
          { label: '@badtaste', href: 'https://instagram.com/badtaste', external: true },
          { label: '+351 900 000 000', href: 'tel:+351900000000' },
        ].map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              opacity: 0.65,
              cursor: 'crosshair',
              transition: 'opacity 0.2s',
              color: '#eeece8',
              textDecoration: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.65'}
          >
            {label}
          </a>
        ))}
        <p style={{ fontSize: '11px', letterSpacing: '0.08em', opacity: 0.4, marginTop: '1rem' }}>
          © 2026 Bad Taste
        </p>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [hoveredProject, setHoveredProject] = useState(null)

  const projectIndex = projects.findIndex(p => p.slug === hoveredProject?.slug)


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Wheel section — full viewport height */}
      <main style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <BackgroundSlideshow paused={!!hoveredProject} videoProject={hoveredProject} />

        <RotatingWheel projects={projects} onHoverChange={setHoveredProject} />

        {hoveredProject && (
          <VideoPreview
            project={hoveredProject}
            projectIndex={projectIndex}
            totalProjects={projects.length}
          />
        )}
      </main>

      {/* Contacts footer — always visible */}
      <ContactsSection />
    </div>
  )
}
