import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getGallery } from '../admin/galleryData';
import ContactsFooter from '../components/ContactsFooter';

function GalleryCard({ photo, index, total, onClick }) {
  const [hovered, setHovered] = useState(false)
  const padded = String(index + 1).padStart(2, '0')
  const paddedTotal = String(total).padStart(2, '0')

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        cursor: 'crosshair',
        background: '#0a0a0a',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
    >
      <img
        src={photo.path}
        alt={photo.caption || ''}
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

      {/* Caption — only on hover */}
      {photo.caption && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', pointerEvents: 'none',
          padding: 'clamp(1rem, 3vw, 2rem)',
          gap: '0.4rem',
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
          <h3 style={{
            fontSize: 'clamp(0.9rem, 2.2vw, 1.4rem)',
            fontWeight: '700', color: '#eeece8',
            letterSpacing: '0.1em', margin: 0, lineHeight: 1.1,
          }}>
            {photo.caption.toUpperCase()}
          </h3>
        </div>
      )}

      {/* Counter (no caption) */}
      {!photo.caption && (
        <div style={{
          position: 'absolute', bottom: 'clamp(0.8rem, 2vw, 1.2rem)',
          right: 'clamp(0.8rem, 2vw, 1.2rem)',
          pointerEvents: 'none',
          opacity: hovered ? 0.6 : 0,
          transition: 'opacity 0.4s ease',
        }}>
          <p style={{
            fontSize: 'clamp(8px, 1vw, 9px)',
            color: '#eeece8', letterSpacing: '0.3em',
            fontWeight: '600', margin: 0,
          }}>
            {padded} / {paddedTotal}
          </p>
        </div>
      )}
    </div>
  )
}

const GalleryPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      const data = await getGallery();
      setGallery(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
    };
    fetchGallery();
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else goBack();
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') setLightboxIndex(prev => prev > 0 ? prev - 1 : gallery.length - 1);
        if (e.key === 'ArrowRight') setLightboxIndex(prev => prev < gallery.length - 1 ? prev + 1 : 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, gallery.length]);

  const goBack = () => {
    setVisible(false);
    setTimeout(() => navigate('/fotos'), 250);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#eeece8', opacity: 0.3 }}>—</span>
      </div>
    );
  }

  const isOdd = gallery.length % 2 !== 0

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      fontFamily: 'Space Grotesk, sans-serif',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @media (max-width: 600px) {
          [data-gallery-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0,
        height: 'clamp(50px, 10vw, 60px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1rem, 3vw, 1.75rem)',
        zIndex: 100, background: '#111',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        gap: '1rem', flexShrink: 0,
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
          <svg width="clamp(26px, 4vw, 32px)" height="clamp(26px, 4vw, 32px)" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="#eeece8"/>
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: '700', letterSpacing: '0.12em', color: '#eeece8' }}>
            BAD TASTE
          </span>
        </Link>

        <span style={{
          fontSize: 'clamp(10px, 1.2vw, 11px)', fontWeight: '700',
          letterSpacing: '0.15em', color: '#eeece8',
          borderBottom: '1px solid #eeece8', paddingBottom: '1px',
        }}>
          {t.photos?.title || 'FOTOS'}
        </span>
      </nav>

      {/* Photo grid */}
      {gallery.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(11px, 1.3vw, 12px)', letterSpacing: '0.15em',
          color: '#eeece8', opacity: 0.25,
        }}>
          {t.photos?.empty || 'NENHUMA FOTO DISPONÍVEL'}
        </div>
      ) : (
        <div data-gallery-grid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          background: '#000',
          flex: 1,
        }}>
          {gallery.map((photo, idx) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              index={idx}
              total={gallery.length}
              onClick={() => setLightboxIndex(idx)}
            />
          ))}
          {/* Fill last row if odd */}
          {isOdd && (
            <div style={{ background: '#0a0a0a', aspectRatio: '1 / 1' }} />
          )}
        </div>
      )}

      <ContactsFooter />

      {/* Lightbox */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.97)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            style={{
              position: 'absolute', top: 'clamp(16px, 3vw, 28px)', right: 'clamp(16px, 3vw, 28px)',
              fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#eeece8', cursor: 'crosshair',
              padding: '8px 14px', background: 'none', border: '1px solid rgba(238,236,232,0.2)',
              fontFamily: 'inherit', letterSpacing: '0.1em', opacity: 0.7, transition: 'opacity 0.2s',
            }}
            onClick={() => setLightboxIndex(null)}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
          >✕</button>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: 'clamp(16px, 3vw, 28px)', left: 'clamp(16px, 3vw, 28px)',
            fontSize: 'clamp(9px, 1.1vw, 10px)', color: '#eeece8', opacity: 0.4,
            letterSpacing: '0.25em', fontWeight: '600',
          }}>
            {String(lightboxIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
          </div>

          {/* Prev */}
          <button
            style={{
              position: 'absolute', top: '50%', left: 'clamp(16px, 3vw, 28px)',
              transform: 'translateY(-50%)',
              fontSize: 'clamp(20px, 3vw, 28px)', color: '#eeece8', cursor: 'crosshair',
              padding: '12px 18px', background: 'none', border: 'none',
              opacity: 0.5, transition: 'opacity 0.2s',
            }}
            onClick={e => { e.stopPropagation(); setLightboxIndex(p => p > 0 ? p - 1 : gallery.length - 1) }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          >‹</button>

          <img
            src={gallery[lightboxIndex].path}
            alt={gallery[lightboxIndex].caption || ''}
            style={{ maxWidth: '88vw', maxHeight: '88vh', objectFit: 'contain' }}
            onClick={e => e.stopPropagation()}
          />

          {/* Caption */}
          {gallery[lightboxIndex].caption && (
            <div style={{
              position: 'absolute', bottom: 'clamp(1.5rem, 3vw, 2.5rem)',
              left: '50%', transform: 'translateX(-50%)',
              color: '#eeece8', fontSize: 'clamp(9px, 1.1vw, 11px)',
              letterSpacing: '0.2em', fontWeight: '600', opacity: 0.5,
              whiteSpace: 'nowrap',
            }}
              onClick={e => e.stopPropagation()}
            >
              {gallery[lightboxIndex].caption.toUpperCase()}
            </div>
          )}

          {/* Next */}
          <button
            style={{
              position: 'absolute', top: '50%', right: 'clamp(16px, 3vw, 28px)',
              transform: 'translateY(-50%)',
              fontSize: 'clamp(20px, 3vw, 28px)', color: '#eeece8', cursor: 'crosshair',
              padding: '12px 18px', background: 'none', border: 'none',
              opacity: 0.5, transition: 'opacity 0.2s',
            }}
            onClick={e => { e.stopPropagation(); setLightboxIndex(p => p < gallery.length - 1 ? p + 1 : 0) }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          >›</button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
