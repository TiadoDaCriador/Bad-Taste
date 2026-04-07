import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext';
import { getGallery } from '../admin/galleryData';
import ContactsFooter from '../components/ContactsFooter';

function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage()
  return (
    <div style={{ display: 'flex', gap: 'clamp(0.4rem, 1vw, 0.6rem)', alignItems: 'center' }}>
      {LANGUAGES.map((l, i) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.4rem, 1vw, 0.6rem)' }}>
          <button
            onClick={() => changeLanguage(l)}
            style={{
              fontSize: 'clamp(9px, 1.2vw, 10px)', fontWeight: '600', letterSpacing: '0.15em',
              color: '#eeece8', background: 'none', border: 'none', cursor: 'crosshair', padding: 0,
              opacity: lang === l ? 1 : 0.35, transition: 'opacity 0.2s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (lang !== l) e.currentTarget.style.opacity = '0.65' }}
            onMouseLeave={e => { if (lang !== l) e.currentTarget.style.opacity = '0.35' }}
          >{l.toUpperCase()}</button>
          {i < LANGUAGES.length - 1 && (
            <span style={{ fontSize: 'clamp(9px, 1.2vw, 10px)', color: '#eeece8', opacity: 0.2 }}>|</span>
          )}
        </span>
      ))}
    </div>
  )
}

function PhotoAlbumCard({ photo, index, total, onClick }) {
  const [hovered, setHovered] = useState(false)
  const name = photo.caption || 'FOTOS'
  const padded = String(index + 1).padStart(2, '0')
  const paddedTotal = String(total).padStart(2, '0')

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '16/9',
        overflow: 'hidden',
        cursor: 'crosshair',
        background: '#0a0a0a',
      }}
    >
      {/* Image */}
      <img
        src={photo.path}
        alt={name}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          transition: 'transform 0.8s ease',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }}
      />

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
        gap: 'clamp(0.4rem, 1vw, 0.6rem)',
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
          {name.toUpperCase()}
        </h2>
        <p style={{
          fontSize: 'clamp(7px, 0.9vw, 9px)',
          color: '#eeece8', opacity: 0.5,
          letterSpacing: '0.25em', fontWeight: '500', margin: 0,
        }}>
          VER GALERIA
        </p>
      </div>
    </div>
  )
}

const PhotosPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      const data = await getGallery();
      const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      // Use cover photo as the album entry; fallback to first photo
      const cover = sorted.find(p => p.isCover) || sorted[0] || null;
      setAlbums(cover ? [cover] : []);
      setLoading(false);
    };
    fetchGallery();
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') goBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const goBack = () => {
    setVisible(false);
    setTimeout(() => navigate('/'), 250);
  };

  const goToGallery = () => {
    setVisible(false);
    setTimeout(() => navigate('/fotos/galeria'), 250);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#eeece8', opacity: 0.3 }}>—</span>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      fontFamily: 'Space Grotesk, sans-serif',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0,
        height: 'clamp(50px, 10vw, 60px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1rem, 3vw, 1.75rem)',
        zIndex: 100, background: '#111',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        gap: 'clamp(1rem, 2vw, 1.5rem)', flexWrap: 'wrap', flexShrink: 0,
      }}>
        <button
          onClick={goBack}
          style={{
            background: 'none', border: 'none', cursor: 'crosshair',
            fontSize: 'clamp(10px, 1.2vw, 11px)', fontFamily: 'inherit',
            letterSpacing: '0.12em', color: '#eeece8', padding: 0,
            opacity: 0.5, transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
        >
          ← {t.project?.back?.replace('← ', '') || 'VOLVER'}
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)', textDecoration: 'none', cursor: 'crosshair' }}>
          <svg width="clamp(28px, 5vw, 36px)" height="clamp(28px, 5vw, 36px)" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="#eeece8"/>
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: '700', letterSpacing: '0.12em', color: '#eeece8' }}>BAD TASTE</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2vw, 2.5rem)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Link
            to="/video"
            style={{
              fontSize: 'clamp(10px, 1.2vw, 11px)', fontWeight: '600',
              letterSpacing: '0.15em', color: '#eeece8', opacity: 0.45,
              textDecoration: 'none', cursor: 'crosshair', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
          >
            VIDEO
          </Link>
          <span style={{
            fontSize: 'clamp(10px, 1.2vw, 11px)', fontWeight: '700',
            letterSpacing: '0.15em', color: '#eeece8',
            borderBottom: '1px solid #eeece8', paddingBottom: '1px',
          }}>
            {t.photos?.title || 'FOTOS'}
          </span>
          <Link
            to="/contactos"
            style={{
              fontSize: 'clamp(10px, 1.2vw, 11px)', fontWeight: '600',
              letterSpacing: '0.15em', color: '#eeece8', opacity: 0.45,
              textDecoration: 'none', cursor: 'crosshair', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
          >
            {t.nav?.contacts || 'CONTACTO'}
          </Link>
          <div style={{ width: '1px', height: 'clamp(10px, 1.5vw, 12px)', background: '#eeece8', opacity: 0.15 }} />
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1px',
        background: '#000',
        flex: 1,
      }}>
        {albums.length === 0 ? (
          <div
            onClick={goToGallery}
            style={{
              aspectRatio: '16/9', cursor: 'crosshair',
              background: '#181818', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: '700',
              color: '#eeece8', letterSpacing: '0.12em', opacity: 0.3,
            }}>
              {(t.photos?.title || 'FOTOS').toUpperCase()}
            </span>
          </div>
        ) : (
          albums.map((photo, i) => (
            <PhotoAlbumCard
              key={photo.id}
              photo={photo}
              index={i}
              total={albums.length}
              onClick={goToGallery}
            />
          ))
        )}
      </div>

      <ContactsFooter />
    </div>
  );
};

export default PhotosPage;
