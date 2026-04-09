import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getGallery } from '../admin/galleryData';
import ContactsFooter from '../components/ContactsFooter';
import Navbar from '../components/Navbar';

function GalleryCard({ photo, index, total, onClick }) {
  const [hovered, setHovered] = useState(false)
  const padded = String(index + 1).padStart(2, '0')
  const paddedTotal = String(total).padStart(2, '0')

  return (
    <div
      data-gallery-card
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
      <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#eeece8', opacity: 0.3 }}>—</span>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      fontFamily: 'Space Grotesk, sans-serif',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @media (max-width: 900px) {
          [data-gallery-grid] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          [data-gallery-grid] { grid-template-columns: 1fr !important; }
          [data-gallery-card] { aspect-ratio: 3/4 !important; }
        }
      `}</style>

      <Navbar theme="dark" variant="sticky" activeItem="photos" showBack onBack={goBack} />

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
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
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
