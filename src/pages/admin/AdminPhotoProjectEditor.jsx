import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isAuthenticated } from '../../admin/adminAuth'
import {
  getPhotoProjects, updatePhotoProject,
  getPhotoProjectPhotos, addPhotoToProject,
  updateProjectPhoto, deleteProjectPhoto,
} from '../../admin/photoProjectsData'
import { uploadPhoto } from '../../admin/galleryData'

const mono = { fontFamily: 'Space Grotesk, sans-serif' }

const s = {
  page: { minHeight: '100vh', background: '#1a1a1a', color: '#eeece8', ...mono, cursor: 'crosshair' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: 'clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 2rem)',
    borderBottom: '1px solid rgba(238,236,232,0.1)',
    position: 'sticky', top: 0, background: '#1a1a1a', zIndex: 10,
    flexWrap: 'wrap', gap: '1rem',
  },
  body: { maxWidth: '900px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)' },
  section: { marginBottom: '3rem' },
  sectionTitle: { fontSize: 'clamp(8px, 1.5vw, 9px)', fontWeight: '700', letterSpacing: '0.25em', opacity: 0.4, marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(238,236,232,0.1)', display: 'block' },
  btnPrimary: {
    background: '#eeece8', border: 'none', color: '#111',
    fontSize: 'clamp(8px, 1.5vw, 9px)', fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '700', letterSpacing: '0.2em',
    padding: 'clamp(0.4rem, 1vw, 0.55rem) clamp(0.8rem, 2vw, 1.25rem)',
    cursor: 'crosshair', transition: 'opacity 0.2s',
  },
  btnGhost: {
    background: 'none', border: '1px solid rgba(238,236,232,0.2)', color: '#eeece8',
    fontSize: 'clamp(8px, 1.5vw, 9px)', fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '600', letterSpacing: '0.15em',
    padding: 'clamp(0.35rem, 1vw, 0.45rem) clamp(0.7rem, 1.5vw, 1rem)',
    cursor: 'crosshair', transition: 'all 0.2s',
  },
  btnDanger: {
    background: 'none', border: '1px solid rgba(255,80,80,0.25)', color: 'rgba(255,100,100,0.7)',
    fontSize: 'clamp(8px, 1.5vw, 9px)', fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '600', letterSpacing: '0.15em',
    padding: 'clamp(0.35rem, 1vw, 0.45rem) clamp(0.7rem, 1.5vw, 1rem)',
    cursor: 'crosshair', transition: 'all 0.2s',
  },
  inputField: {
    background: 'none', border: 'none', borderBottom: '1px solid rgba(238,236,232,0.2)',
    color: '#eeece8', fontSize: 'clamp(12px, 1.5vw, 13px)', fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '300', letterSpacing: '0.04em',
    padding: 'clamp(0.5rem, 1vw, 0.65rem) 0', outline: 'none', cursor: 'text', width: '100%',
  },
  formRow: { display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 1vw, 0.5rem)', marginBottom: 'clamp(1.2rem, 3vw, 1.75rem)' },
  label: { fontSize: 'clamp(8px, 1.2vw, 9px)', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.35 },
}

export default function AdminPhotoProjectEditor() {
  const navigate = useNavigate()
  const { slug } = useParams()

  const [project, setProject] = useState(null)
  const [title, setTitle] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [titleSaved, setTitleSaved] = useState(false)

  const [photos, setPhotos] = useState([])
  const [photoUploading, setPhotoUploading] = useState(false)
  const [editingCaption, setEditingCaption] = useState(null)
  const [captionValue, setCaptionValue] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/admin'); return }
    async function load() {
      const [projects, projectPhotos] = await Promise.all([
        getPhotoProjects(),
        getPhotoProjectPhotos(slug),
      ])
      const found = projects.find(p => p.slug === slug)
      if (!found) { navigate('/admin/dashboard'); return }
      setProject(found)
      setTitle(found.title)
      setThumbnail(found.thumbnail || '')
      setPhotos(projectPhotos.sort((a, b) => (a.order || 0) - (b.order || 0)))
    }
    load()
  }, [slug])

  const handleSaveTitle = async (e) => {
    e.preventDefault()
    await updatePhotoProject(slug, { title, thumbnail })
    setProject(p => ({ ...p, title, thumbnail }))
    setTitleSaved(true)
    setTimeout(() => setTitleSaved(false), 2000)
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnailUploading(true)
    try {
      const result = await uploadPhoto(file)
      setThumbnail(result.path)
      await updatePhotoProject(slug, { title, thumbnail: result.path })
      setProject(p => ({ ...p, thumbnail: result.path }))
    } catch (err) {
      alert('Erro no upload: ' + err.message)
    } finally {
      setThumbnailUploading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const result = await uploadPhoto(file)
      const photo = await addPhotoToProject(slug, { path: result.path })
      setPhotos(prev => [...prev, photo])
    } catch (err) {
      alert('Erro no upload: ' + err.message)
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSaveCaption = async (photoId) => {
    await updateProjectPhoto(slug, photoId, { caption: captionValue })
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, caption: captionValue } : p))
    setEditingCaption(null)
    setCaptionValue('')
  }

  const handleDeletePhoto = async (photoId) => {
    if (deleteConfirm !== photoId) {
      setDeleteConfirm(photoId)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }
    await deleteProjectPhoto(slug, photoId)
    setPhotos(prev => prev.filter(p => p.id !== photoId))
    setDeleteConfirm(null)
  }

  if (!project) return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>
      <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#eeece8', opacity: 0.3 }}>—</span>
    </div>
  )

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 2vw, 10px)' }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="#eeece8" />
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em' }}>FOTOS — {project.title.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            style={s.btnGhost}
            onClick={() => navigate('/admin/dashboard')}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
          >← DASHBOARD</button>
          <button
            style={s.btnGhost}
            onClick={() => window.open(`/fotos/${slug}`, '_blank')}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
          >VER PROJETO</button>
        </div>
      </header>

      <div style={s.body}>
        {/* Info section */}
        <section style={s.section}>
          <span style={s.sectionTitle}>INFORMAÇÃO DO PROJETO</span>
          <form onSubmit={handleSaveTitle} style={{ maxWidth: '480px' }}>
            <div style={s.formRow}>
              <label style={s.label}>TÍTULO</label>
              <input
                style={s.inputField}
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Título do projeto..."
                required
              />
            </div>

            <div style={s.formRow}>
              <label style={s.label}>FOTO DE PREVIEW (thumbnail do card)</label>
              {thumbnail && (
                <img src={thumbnail} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover', marginBottom: '0.75rem', opacity: 0.8 }} />
              )}
              <label style={{ ...s.btnGhost, display: 'inline-block', marginBottom: '0.5rem', cursor: 'crosshair' }}>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={thumbnailUploading} style={{ display: 'none' }} />
                {thumbnailUploading ? 'CARREGANDO...' : (thumbnail ? 'SUBSTITUIR FOTO' : '+ CARREGAR FOTO PREVIEW')}
              </label>
            </div>

            <button
              type="submit"
              style={s.btnPrimary}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {titleSaved ? 'GUARDADO ✓' : 'GUARDAR'}
            </button>
          </form>
        </section>

        {/* Photos section */}
        <section style={s.section}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(238,236,232,0.1)', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', fontWeight: '700', letterSpacing: '0.25em', opacity: 0.4 }}>
              FOTOS DO PROJETO — {photos.length}
            </span>
            <label style={{ ...s.btnPrimary, display: 'inline-block', marginBottom: 0, cursor: 'crosshair' }}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={photoUploading} style={{ display: 'none' }} />
              {photoUploading ? '+ CARREGANDO...' : '+ ADICIONAR FOTO'}
            </label>
          </div>

          {photos.length === 0 ? (
            <p style={{ opacity: 0.3, fontSize: 'clamp(11px, 1.5vw, 12px)', letterSpacing: '0.05em' }}>Nenhuma foto. Adiciona a primeira.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 20vw, 200px), 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
            }}>
              {photos.map(photo => (
                <div key={photo.id} style={{
                  backgroundColor: 'rgba(238,236,232,0.05)',
                  border: '1px solid rgba(238,236,232,0.1)',
                  overflow: 'hidden',
                }}>
                  <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
                    <img src={photo.path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                    {editingCaption === photo.id ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <input
                          autoFocus
                          type="text"
                          value={captionValue}
                          onChange={e => setCaptionValue(e.target.value)}
                          placeholder="Caption..."
                          style={{ ...s.inputField, fontSize: 'clamp(10px, 1.2vw, 11px)', padding: '0.25rem 0', marginBottom: 0 }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveCaption(photo.id)
                            if (e.key === 'Escape') setEditingCaption(null)
                          }}
                        />
                        <button
                          onClick={() => handleSaveCaption(photo.id)}
                          style={{ fontSize: '11px', padding: '0.25rem 0.5rem', background: 'rgba(238,236,232,0.2)', border: 'none', color: '#eeece8', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600' }}
                        >✓</button>
                      </div>
                    ) : (
                      <div
                        onClick={() => { setEditingCaption(photo.id); setCaptionValue(photo.caption || '') }}
                        style={{ cursor: 'pointer', opacity: 0.6, minHeight: '1.2em', fontSize: 'clamp(10px, 1.2vw, 11px)', transition: 'opacity 0.2s', wordBreak: 'break-word' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                      >
                        {photo.caption || '(sem caption)'}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '0.5rem', paddingTop: 0 }}>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      style={{
                        ...s.btnDanger, width: '100%',
                        padding: 'clamp(0.3rem, 1vw, 0.35rem)',
                        fontSize: 'clamp(8px, 1.2vw, 9px)',
                        ...(deleteConfirm === photo.id ? { background: 'rgba(255,80,80,0.15)', borderColor: 'rgba(255,80,80,0.6)', color: '#ff6b6b' } : {}),
                      }}
                      onMouseEnter={e => { if (deleteConfirm !== photo.id) { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'; e.currentTarget.style.color = 'rgba(255,100,100,1)' } }}
                      onMouseLeave={e => { if (deleteConfirm !== photo.id) { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.25)'; e.currentTarget.style.color = 'rgba(255,100,100,0.7)' } }}
                    >
                      {deleteConfirm === photo.id ? 'CONFIRMAR?' : 'APAGAR'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
