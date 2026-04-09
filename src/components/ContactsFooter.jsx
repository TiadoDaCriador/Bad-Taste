import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { getContacts, defaultContacts } from '../admin/adminData'

export default function ContactsFooter() {
  const { t } = useLanguage()
  const [contacts, setContacts] = useState(defaultContacts)

  useEffect(() => {
    getContacts().then(setContacts)
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        background: '#111',
        color: '#eeece8',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
    >
      {/* Main footer content */}
      <div
        style={{
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 1.75rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 30vw, 260px), 1fr))',
          gap: 'clamp(3rem, 6vw, 5rem)',
          cursor: 'default',
        }}
      >
        {/* Column 1: Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)' }}>
            <svg width="clamp(32px, 5vw, 40px)" height="clamp(32px, 5vw, 40px)" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" fill="#eeece8"/>
              <text x="50%" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111" textAnchor="middle">BT</text>
            </svg>
            <span style={{
              fontSize: 'clamp(13px, 2vw, 16px)',
              fontWeight: '700',
              letterSpacing: '0.12em',
            }}>BAD TASTE</span>
          </div>
          <p style={{
            fontSize: 'clamp(10px, 1.1vw, 11px)',
            lineHeight: '1.6',
            opacity: 0.55,
            letterSpacing: '0.04em',
            margin: 0,
          }}>
            {t.footer.description}<br />{t.footer.location}
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 1.8vw, 1.5rem)' }}>
          <p style={{
            fontSize: 'clamp(9px, 1vw, 10px)',
            fontWeight: '700',
            letterSpacing: '0.15em',
            opacity: 0.5,
            margin: '0 0 0.5rem 0',
          }}>
            NAVEGAR
          </p>
          <Link
            to="/video"
            style={{
              fontSize: 'clamp(10px, 1.1vw, 11px)',
              letterSpacing: '0.12em',
              opacity: 0.65,
              cursor: 'crosshair',
              transition: 'opacity 0.2s, border-bottom 0.2s',
              color: '#eeece8',
              textDecoration: 'none',
              paddingBottom: '2px',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.borderBottom = '1px solid rgba(238, 236, 232, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.65'
              e.currentTarget.style.borderBottom = '1px solid transparent'
            }}
          >
            VIDEO
          </Link>
          <Link
            to="/fotos"
            style={{
              fontSize: 'clamp(10px, 1.1vw, 11px)',
              letterSpacing: '0.12em',
              opacity: 0.65,
              cursor: 'crosshair',
              transition: 'opacity 0.2s, border-bottom 0.2s',
              color: '#eeece8',
              textDecoration: 'none',
              paddingBottom: '2px',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.borderBottom = '1px solid rgba(238, 236, 232, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.65'
              e.currentTarget.style.borderBottom = '1px solid transparent'
            }}
          >
            FOTOS
          </Link>
          <Link
            to="/contactos"
            style={{
              fontSize: 'clamp(10px, 1.1vw, 11px)',
              letterSpacing: '0.12em',
              opacity: 0.65,
              cursor: 'crosshair',
              transition: 'opacity 0.2s, border-bottom 0.2s',
              color: '#eeece8',
              textDecoration: 'none',
              paddingBottom: '2px',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.borderBottom = '1px solid rgba(238, 236, 232, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.65'
              e.currentTarget.style.borderBottom = '1px solid transparent'
            }}
          >
            CONTACTO
          </Link>
        </div>

        {/* Column 3: Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 1.8vw, 1.5rem)' }}>
          <p style={{
            fontSize: 'clamp(9px, 1vw, 10px)',
            fontWeight: '700',
            letterSpacing: '0.15em',
            opacity: 0.5,
            margin: '0 0 0.5rem 0',
          }}>
            CONTACTO
          </p>
          <a
            href={`mailto:${contacts.email}`}
            style={{
              fontSize: 'clamp(10px, 1.1vw, 11px)',
              letterSpacing: '0.12em',
              opacity: 0.65,
              cursor: 'crosshair',
              transition: 'opacity 0.2s, border-bottom 0.2s',
              color: '#eeece8',
              textDecoration: 'none',
              paddingBottom: '2px',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.borderBottom = '1px solid rgba(238, 236, 232, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.65'
              e.currentTarget.style.borderBottom = '1px solid transparent'
            }}
          >
            {contacts.email}
          </a>
          <a
            href={contacts.instagramUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 'clamp(10px, 1.1vw, 11px)',
              letterSpacing: '0.12em',
              opacity: 0.65,
              cursor: 'crosshair',
              transition: 'opacity 0.2s, border-bottom 0.2s',
              color: '#eeece8',
              textDecoration: 'none',
              paddingBottom: '2px',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.borderBottom = '1px solid rgba(238, 236, 232, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.65'
              e.currentTarget.style.borderBottom = '1px solid transparent'
            }}
          >
            {contacts.instagram}
          </a>
          <a
            href={`tel:${contacts.phone.replace(/\s/g, '')}`}
            style={{
              fontSize: 'clamp(10px, 1.1vw, 11px)',
              letterSpacing: '0.12em',
              opacity: 0.65,
              cursor: 'crosshair',
              transition: 'opacity 0.2s, border-bottom 0.2s',
              color: '#eeece8',
              textDecoration: 'none',
              paddingBottom: '2px',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.borderBottom = '1px solid rgba(238, 236, 232, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.65'
              e.currentTarget.style.borderBottom = '1px solid transparent'
            }}
          >
            {contacts.phone}
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 1.75rem)',
          textAlign: 'center',
          fontSize: 'clamp(9px, 1vw, 10px)',
          letterSpacing: '0.1em',
          opacity: 0.4,
        }}
      >
        {t.footer.copyright}
      </div>
    </section>
  )
}
