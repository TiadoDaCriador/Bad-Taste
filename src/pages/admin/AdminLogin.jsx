import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../admin/adminAuth'

const s = {
  page: {
    position: 'fixed',
    inset: 0,
    background: '#111',
    color: '#eeece8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Space Grotesk, sans-serif',
    cursor: 'crosshair',
  },
  box: {
    width: '100%',
    maxWidth: '360px',
    padding: '0 1.5rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '3rem',
  },
  label: {
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '0.25em',
    opacity: 0.4,
    display: 'block',
    marginBottom: '0.6rem',
  },
  input: {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid rgba(238,236,232,0.2)',
    color: '#eeece8',
    fontSize: '14px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '300',
    letterSpacing: '0.04em',
    padding: '0.75rem 0',
    outline: 'none',
    cursor: 'text',
  },
  btn: {
    width: '100%',
    background: '#eeece8',
    border: 'none',
    color: '#111',
    fontSize: '10px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '700',
    letterSpacing: '0.2em',
    padding: '1rem',
    cursor: 'crosshair',
    marginTop: '2.5rem',
    transition: 'opacity 0.2s',
  },
  error: {
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: '#ff6b6b',
    marginTop: '0.75rem',
  },
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(password)) {
      navigate('/admin/dashboard')
    } else {
      setError(true)
      setPassword('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={s.logo}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="#eeece8" />
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.12em' }}>ADMIN</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={s.label}>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            style={s.input}
            placeholder="..."
          />
          {error && <p style={s.error}>PASSWORD INCORRETA</p>}
          <button
            type="submit"
            style={s.btn}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  )
}
