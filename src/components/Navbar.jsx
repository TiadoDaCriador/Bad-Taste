import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar({ theme = 'dark', variant = 'sticky', activeItem = null, showBack = false, onBack = null, autoColor = false }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [])

  const isLight = theme === 'light'
  const bgColor = autoColor ? 'transparent' : (isLight ? 'transparent' : '#111')
  const textColor = autoColor ? 'white' : (isLight ? '#111' : '#eeece8')
  const borderColor = isLight ? 'rgba(17, 17, 17, 0.1)' : 'rgba(255, 255, 255, 0.08)'
  const inactiveLinkOpacity = isLight ? 0.75 : 0.45
  const mixBlendMode = autoColor ? 'difference' : 'normal'

  const navLinks = [
    { label: t.nav.video, to: '/video', key: 'video' },
    { label: t.nav.photos, to: '/fotos', key: 'photos' },
    { label: t.nav.contacts, to: '/contactos', key: 'contacts' },
  ]

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <>
      {/* Main Navbar */}
      <nav
        style={{
          position: variant,
          top: 0,
          left: 0,
          right: 0,
          height: 'clamp(50px, 10vw, 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1rem, 3vw, 1.75rem)',
          zIndex: 100,
          gap: 'clamp(1rem, 2vw, 1.5rem)',
          backgroundColor: bgColor,
          borderBottom: autoColor ? 'none' : (variant === 'sticky' && !isLight ? `1px solid ${borderColor}` : 'none'),
          pointerEvents: 'auto',
          mixBlendMode: mixBlendMode,
        }}
      >
        {/* Left: Back button + Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
        }}>
          {showBack && (
            <button
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                fontSize: 'clamp(10px, 1.2vw, 11px)',
                fontWeight: '600',
                letterSpacing: '0.15em',
                cursor: 'crosshair',
                padding: 0,
                opacity: 0.75,
                transition: 'opacity 0.2s',
                mixBlendMode: mixBlendMode,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
            >
              ← VOLVER
            </button>
          )}

          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(6px, 1.5vw, 10px)',
          }}>
            <svg width="clamp(28px, 5vw, 36px)" height="clamp(28px, 5vw, 36px)" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Bad Taste">
              <rect width="36" height="36" fill={autoColor ? 'none' : (isLight ? '#111' : 'none')} stroke={autoColor ? 'white' : (isLight ? 'none' : textColor)} strokeWidth={autoColor ? 1.5 : (isLight ? 0 : 1.5)}/>
              <text x="50%" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill={autoColor ? 'white' : (isLight ? '#eeece8' : '#111')} textAnchor="middle">BT</text>
            </svg>
            {!isMobile && (
              <span style={{
                fontSize: 'clamp(12px, 2vw, 15px)',
                fontWeight: '700',
                letterSpacing: '0.12em',
                color: textColor,
              }}>BAD TASTE</span>
            )}
          </div>
        </div>

        {/* Right: Desktop menu or hamburger */}
        {!isMobile ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.2rem, 2vw, 2.5rem)',
            justifyContent: 'flex-end',
          }}>
            {navLinks.map(({ label, to, key }) => {
              const isActive = activeItem === key
              return (
                <Link
                  key={key}
                  to={to}
                  style={{
                    fontSize: 'clamp(10px, 1.2vw, 11px)',
                    fontWeight: '600',
                    letterSpacing: '0.15em',
                    color: textColor,
                    cursor: 'crosshair',
                    opacity: isActive ? 1 : inactiveLinkOpacity,
                    transition: 'opacity 0.2s',
                    textDecoration: 'none',
                    borderBottom: isActive ? `1px solid ${textColor}` : 'none',
                    paddingBottom: isActive ? '2px' : '0',
                    mixBlendMode: mixBlendMode,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.opacity = '0.8' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.opacity = inactiveLinkOpacity }}
                >
                  {label}
                </Link>
              )
            })}

            <div style={{
              width: '1px',
              height: 'clamp(10px, 1.5vw, 12px)',
              background: textColor,
              opacity: 0.2,
            }} />

            <LanguageSwitcher color={textColor} blendMode={mixBlendMode} />
          </div>
        ) : (
          !menuOpen && (
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                fontSize: 'clamp(18px, 5vw, 24px)',
                cursor: 'crosshair',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mixBlendMode: mixBlendMode,
              }}
            >
              ☰
            </button>
          )
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#1a1a1a',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(2rem, 5vw, 3rem)',
            gap: 'clamp(3rem, 6vw, 4.5rem)',
            overflow: 'auto',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 'clamp(1rem, 3vw, 1.75rem)',
              right: 'clamp(1rem, 3vw, 1.75rem)',
              background: 'none',
              border: 'none',
              color: '#eeece8',
              fontSize: 'clamp(24px, 6vw, 32px)',
              cursor: 'crosshair',
              padding: 0,
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
          >
            ✕
          </button>

          {/* Navigation links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(2.5rem, 5vw, 3.5rem)',
            width: '100%',
          }}>
            {navLinks.map(({ label, to, key }) => (
              <Link
                key={key}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  fontWeight: '700',
                  letterSpacing: '0.15em',
                  color: autoColor ? 'white' : '#eeece8',
                  cursor: 'crosshair',
                  opacity: 0.8,
                  transition: 'opacity 0.2s',
                  textDecoration: 'none',
                  textAlign: 'center',
                  mixBlendMode: autoColor ? 'difference' : 'normal',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Language switcher at bottom */}
          <div style={{
            position: 'absolute',
            bottom: 'clamp(2rem, 4vw, 3rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(1rem, 2vw, 1.5rem)',
          }}>
            <div style={{
              fontSize: 'clamp(10px, 1.5vw, 11px)',
              fontWeight: '700',
              letterSpacing: '0.15em',
              color: autoColor ? 'white' : '#eeece8',
              opacity: 0.5,
              mixBlendMode: mixBlendMode,
            }}>
              LINGUA
            </div>
            <LanguageSwitcher color={autoColor ? 'white' : '#eeece8'} blendMode={mixBlendMode} />
          </div>
        </div>
      )}
    </>
  )
}
