import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { getContacts } from '../admin/adminData'

const inputStyle = {
  width: '100%',
  background: 'none',
  border: 'none',
  borderBottom: '1px solid rgba(238, 236, 232, 0.2)',
  color: '#eeece8',
  fontSize: '13px',
  fontFamily: 'Space Grotesk, sans-serif',
  fontWeight: '300',
  letterSpacing: '0.04em',
  padding: '0.75rem 0',
  outline: 'none',
  cursor: 'text',
  transition: 'border-color 0.2s',
}

export default function ContactsPage() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const { t } = useLanguage()
  const f = t.contacts.form

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', email: '', message: '' })
    }, 3000)
  }

  const ci = getContacts()
  const contacts = [
    { label: t.contacts.email, value: ci.email, href: `mailto:${ci.email}` },
    { label: t.contacts.instagram, value: ci.instagram, href: ci.instagramUrl },
    { label: t.contacts.phone, value: ci.phone, href: `tel:${ci.phone.replace(/\s/g, '')}` },
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
      fontFamily: 'Space Grotesk, sans-serif',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 1.75rem',
        borderBottom: '1px solid rgba(238, 236, 232, 0.1)',
        flexShrink: 0,
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
          aria-label={t.contacts.backAriaLabel}
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
          {t.contacts.back}
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        gap: 0,
        padding: '4rem 1.75rem',
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
      }}>
        {/* Left — contact info */}
        <div style={{ paddingRight: '4rem' }}>
          <p style={{
            fontSize: '9px',
            fontWeight: '700',
            letterSpacing: '0.25em',
            opacity: 0.35,
            marginBottom: '3rem',
          }}>{t.contacts.heading}</p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <span style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', opacity: 0.4 }}>
                  {label}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: '300', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  {value}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'rgba(238, 236, 232, 0.1)', margin: '0' }} />

        {/* Right — form */}
        <div style={{ paddingLeft: '4rem' }}>
          <p style={{
            fontSize: '9px',
            fontWeight: '700',
            letterSpacing: '0.25em',
            opacity: 0.35,
            marginBottom: '3rem',
          }}>{f.or}</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', opacity: 0.4 }}>
                {f.name}
              </label>
              <input
                type="text"
                value={form.name}
                placeholder={f.namePlaceholder}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                style={{
                  ...inputStyle,
                  borderBottomColor: focused === 'name' ? 'rgba(238, 236, 232, 0.7)' : 'rgba(238, 236, 232, 0.2)',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', opacity: 0.4 }}>
                {f.emailLabel}
              </label>
              <input
                type="email"
                value={form.email}
                placeholder={f.emailPlaceholder}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                style={{
                  ...inputStyle,
                  borderBottomColor: focused === 'email' ? 'rgba(238, 236, 232, 0.7)' : 'rgba(238, 236, 232, 0.2)',
                }}
              />
            </div>

            {/* Message */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', opacity: 0.4 }}>
                {f.message}
              </label>
              <textarea
                value={form.message}
                placeholder={f.messagePlaceholder}
                rows={4}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                style={{
                  ...inputStyle,
                  resize: 'none',
                  borderBottom: `1px solid ${focused === 'message' ? 'rgba(238, 236, 232, 0.7)' : 'rgba(238, 236, 232, 0.2)'}`,
                  lineHeight: '1.7',
                }}
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                style={{
                  background: sent ? '#eeece8' : 'none',
                  border: '1px solid rgba(238, 236, 232, 0.35)',
                  color: sent ? '#111' : '#eeece8',
                  fontSize: '10px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: '700',
                  letterSpacing: '0.2em',
                  padding: '0.85rem 2.5rem',
                  cursor: 'crosshair',
                  transition: 'background 0.3s, color 0.3s, border-color 0.2s',
                  minWidth: '140px',
                }}
                onMouseEnter={e => {
                  if (!sent) {
                    e.currentTarget.style.background = 'rgba(238, 236, 232, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(238, 236, 232, 0.6)'
                  }
                }}
                onMouseLeave={e => {
                  if (!sent) {
                    e.currentTarget.style.background = 'none'
                    e.currentTarget.style.borderColor = 'rgba(238, 236, 232, 0.35)'
                  }
                }}
              >
                {sent ? f.sent : f.send}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '1.5rem 1.75rem',
        borderTop: '1px solid rgba(238, 236, 232, 0.1)',
        opacity: 0.3,
        fontSize: '10px',
        letterSpacing: '0.1em',
        flexShrink: 0,
      }}>
        {t.contacts.footerText}
      </div>
    </div>
  )
}
