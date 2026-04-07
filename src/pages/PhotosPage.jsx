import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { getGallery } from '../admin/galleryData';

const PhotosPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Fetch gallery on mount
  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      const data = await getGallery();
      // Sort by order
      const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setGallery(sorted);
      setLoading(false);
    };

    fetchGallery();
  }, []);

  // Handle keyboard (ESC, arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        navigate('/');
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
        }
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, gallery.length, navigate]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
  };

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#eeece8',
    padding: '120px 40px 60px',
    fontFamily: "'Space Grotesk', sans-serif",
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 300,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '60px',
    color: '#000',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  };

  const cardStyle = {
    position: 'relative',
    aspectRatio: '1',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#ddd',
    borderRadius: '0px',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
  };

  const cardHoverStyle = {
    transform: 'scale(1.02)',
    opacity: 0.9,
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const captionStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: 400,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    maxHeight: '60px',
    overflow: 'hidden',
  };

  const lightboxStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '40px',
    animation: 'fadeIn 0.3s ease',
  };

  const lightboxImgStyle = {
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
  };

  const lightboxCaptionStyle = {
    position: 'absolute',
    bottom: '40px',
    left: '40px',
    right: '40px',
    color: '#fff',
    fontSize: '14px',
    letterSpacing: '0.02em',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '16px',
  };

  const arrowStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '32px',
    color: '#fff',
    cursor: 'pointer',
    padding: '10px 20px',
    userSelect: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: 'none',
    transition: 'backgroundColor 0.2s',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '32px',
    color: '#fff',
    cursor: 'pointer',
    padding: '10px 20px',
    userSelect: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: 'none',
    transition: 'backgroundColor 0.2s',
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '16px',
    letterSpacing: '0.05em',
    color: '#666',
    textTransform: 'uppercase',
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={emptyStyle}>Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @media (max-width: 768px) {
            [data-grid] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 480px) {
            [data-grid] {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        <h1 style={titleStyle}>{t.photos?.title || 'FOTOS'}</h1>

        {gallery.length === 0 ? (
          <div style={emptyStyle}>{t.photos?.empty || 'Nenhuma foto disponível'}</div>
        ) : (
          <div style={gridStyle} data-grid>
            {gallery.map((photo, idx) => (
              <div
                key={photo.id}
                style={cardStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1)', opacity: 1 })}
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openLightbox(idx);
                  }
                }}
              >
                <img src={photo.path} alt={photo.caption || 'Gallery photo'} style={imgStyle} />
                {photo.caption && <div style={captionStyle}>{photo.caption}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div style={lightboxStyle} onClick={closeLightbox}>
          <button
            style={closeButtonStyle}
            onClick={closeLightbox}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)')}
            aria-label="Close lightbox"
          >
            ✕
          </button>

          <button
            style={{ ...arrowStyle, left: '20px' }}
            onClick={goToPrevious}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)')}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <img
            src={gallery[lightboxIndex].path}
            alt={gallery[lightboxIndex].caption || 'Gallery photo'}
            style={lightboxImgStyle}
            onClick={(e) => e.stopPropagation()}
          />

          {gallery[lightboxIndex].caption && (
            <div style={lightboxCaptionStyle} onClick={(e) => e.stopPropagation()}>
              {gallery[lightboxIndex].caption}
            </div>
          )}

          <button
            style={{ ...arrowStyle, right: '20px', left: 'auto' }}
            onClick={goToNext}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)')}
            aria-label="Next photo"
          >
            ›
          </button>

          {/* Counter */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              color: '#fff',
              fontSize: '12px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {lightboxIndex + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosPage;
