import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ContactsPage() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleBack = () => {
    setVisible(false)
    setTimeout(() => navigate('/'), 300)
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleBack() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const contacts = [
    { label: 'EMAIL', value: 'hello@badtaste.pt', href: 'mailto:hello@badtaste.pt' },
    { label: 'INSTAGRAM', value: '@badtaste', href: 'https://instagram.com/badtaste' },
    { label: 'TELEMÓVEL', value: '+351 900 000 000', href: 'tel:+351900000000' },
  ]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#111',
      color: '#eeece8',
      display: 'flex',
      flexDirection: 'column',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      cursor: 'crosshair',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 1.75rem',
        borderBottom: '1px solid rgba(238, 236, 232, 0.1)',
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            color: '#eeece8',
            cursor: 'crosshair',
            padding: 0,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" fill="#eeece8"/>
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.12em' }}>BAD TASTE</span>
        </button>

        <button
          onClick={handleBack}
          aria-label="Voltar"
          style={{
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '0.2em',
            color: '#eeece8',
            opacity: 0.45,
            background: 'none',
            border: 'none',
            cursor: 'crosshair',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
        >
          ESC — VOLTAR
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 1.75rem',
        maxWidth: '600px',
      }}>
        <p style={{
          fontSize: '9px',
          fontWeight: '700',
          letterSpacing: '0.25em',
          opacity: 0.35,
          marginBottom: '3rem',
        }}>CONTACTO</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {contacts.map(({ label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                padding: '2rem 0',
                borderBottom: '1px solid rgba(238, 236, 232, 0.1)',
                cursor: 'crosshair',
                textDecoration: 'none',
                color: '#eeece8',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.55'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', opacity: 0.4 }}>
                {label}
              </span>
              <span style={{ fontSize: '2rem', fontWeight: '300', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                {value}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '1.5rem 1.75rem',
        borderTop: '1px solid rgba(238, 236, 232, 0.1)',
        opacity: 0.3,
        fontSize: '10px',
        letterSpacing: '0.1em',
      }}>
        © 2026 BAD TASTE — LISBOA, PORTUGAL
      </div>
    </div>
  )
}
