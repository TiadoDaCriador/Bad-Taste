import { useState } from 'react'
import { Link } from 'react-router-dom'
import RotatingWheel from '../components/RotatingWheel'
import BackgroundSlideshow from '../components/BackgroundSlideshow'
import VideoPreview from '../components/VideoPreview'
import { getProjects } from '../admin/adminData'
const projects = getProjects()
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext'

function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage()

  return (
    <div style={{ display: 'flex', gap: 'clamp(0.4rem, 1vw, 0.6rem)', alignItems: 'center', flexWrap: 'wrap' }}>
      {LANGUAGES.map((l, i) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.4rem, 1vw, 0.6rem)' }}>
          <button
            onClick={() => changeLanguage(l)}
            style={{
              fontSize: 'clamp(9px, 1.2vw, 10px)',
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
            <span style={{ fontSize: 'clamp(9px, 1.2vw, 10px)', color: '#111', opacity: 0.2 }}>|</span>
          )}
        </span>
      ))}
    </div>
  )
}

function Navbar() {
  const { t } = useLanguage()

  const navLinks = [
    { label: t.nav.video, to: '/video' },
    { label: t.nav.photos, to: '/fotos' },
    { label: t.nav.contacts, to: '/contactos' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'clamp(50px, 10vw, 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 clamp(1rem, 3vw, 1.75rem)',
      zIndex: 100,
      pointerEvents: 'none',
      gap: 'clamp(1rem, 2vw, 1.5rem)',
      flexWrap: 'wrap',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(6px, 1.5vw, 10px)',
        pointerEvents: 'auto',
      }}>
        <svg width="clamp(28px, 5vw, 36px)" height="clamp(28px, 5vw, 36px)" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Bad Taste">
          <rect width="36" height="36" fill="#111"/>
          <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#eeece8">BT</text>
        </svg>
        <span style={{
          fontSize: 'clamp(12px, 2vw, 15px)',
          fontWeight: '700',
          letterSpacing: '0.12em',
          color: '#111',
          display: { sm: 'none', md: 'block' },
        }}>BAD TASTE</span>
      </div>

      {/* Right side: nav links + language switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(1.2rem, 2vw, 2.5rem)',
        pointerEvents: 'auto',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}>
        {navLinks.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            style={{
              fontSize: 'clamp(10px, 1.2vw, 11px)',
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

        <div style={{
          width: '1px',
          height: 'clamp(10px, 1.5vw, 12px)',
          background: '#111',
          opacity: 0.2,
          display: navLinks.length > 0 ? 'block' : 'none',
        }} />

        <LanguageSwitcher />
      </div>
    </nav>
  )
}

function ContactsSection() {
  const { t } = useLanguage()

  return (
    <section
      id="contacts"
      style={{
        position: 'relative',
        zIndex: 1,
        background: '#111',
        color: '#eeece8',
        padding: 'clamp(2rem, 5vw, 5rem) clamp(1rem, 3vw, 1.75rem) clamp(2rem, 3vw, 4rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 40vw, 280px), 1fr))',
        gap: 'clamp(2rem, 4vw, 3rem)',
        cursor: 'default',
      }}
    >
      {/* Left: brand */}
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

      {/* Middle: links */}
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

      {/* Right: contacts */}
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
