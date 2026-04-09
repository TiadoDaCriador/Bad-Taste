import { useState, useEffect } from 'react'
import RotatingWheel from '../components/RotatingWheel'
import BackgroundSlideshow from '../components/BackgroundSlideshow'
import VideoPreview from '../components/VideoPreview'
import Navbar from '../components/Navbar'
import { getProjects } from '../admin/adminData'
import { useLanguage } from '../i18n/LanguageContext'

function ContactsSection() {
  const { t } = useLanguage()

  return (
    <section
      id="contacts"
      style={{
        position: 'relative',
        zIndex: 1,
        background: '#1a1a1a',
        color: '#eeece8',
        padding: 'clamp(2rem, 5vw, 5rem) clamp(1rem, 3vw, 1.75rem) clamp(2rem, 3vw, 4rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 40vw, 280px), 1fr))',
        gap: 'clamp(2rem, 4vw, 3rem)',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.8rem, 2vw, 1.25rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)' }}>
          <svg width="clamp(28px, 5vw, 36px)" height="clamp(28px, 5vw, 36px)" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" fill="#eeece8"/>
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: '700', letterSpacing: '0.12em' }}>BAD TASTE</span>
        </div>
        <p style={{ fontSize: 'clamp(10px, 1.2vw, 11px)', lineHeight: 1.8, opacity: 0.55, maxWidth: '220px', letterSpacing: '0.04em' }}>
          {t.footer.description}<br />{t.footer.location}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.7rem, 1.5vw, 1rem)' }}>
        <p style={{ fontSize: 'clamp(8px, 1.2vw, 9px)', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '0.25rem' }}>
          {t.footer.navigation}
        </p>
        {t.nav.navItems.map(item => (
          <a
            key={item}
            href="#"
            style={{
              fontSize: 'clamp(10px, 1.2vw, 11px)',
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.7rem, 1.5vw, 1rem)' }}>
        <p style={{ fontSize: 'clamp(8px, 1.2vw, 9px)', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '0.25rem' }}>
          {t.footer.contact}
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
              fontSize: 'clamp(10px, 1.2vw, 11px)',
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
        <p style={{ fontSize: 'clamp(10px, 1.2vw, 11px)', letterSpacing: '0.08em', opacity: 0.4, marginTop: 'clamp(0.5rem, 2vw, 1rem)' }}>
          {t.footer.copyright}
        </p>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [projects, setProjects] = useState([])
  const [hoveredProject, setHoveredProject] = useState(null)

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  const projectIndex = projects.findIndex(p => p.slug === hoveredProject?.slug)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar theme="light" variant="fixed" autoColor={true} />

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

      <ContactsSection />
    </div>
  )
}
