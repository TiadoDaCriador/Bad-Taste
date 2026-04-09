import { useLanguage, LANGUAGES } from '../i18n/LanguageContext'

export default function LanguageSwitcher({ color = '#111' }) {
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
              color: color,
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
            <span style={{ fontSize: 'clamp(9px, 1.2vw, 10px)', color: color, opacity: 0.2 }}>|</span>
          )}
        </span>
      ))}
    </div>
  )
}
