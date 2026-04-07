import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, logout } from '../../admin/adminAuth'
import { getProjects, saveProjects, getContacts, saveContacts } from '../../admin/adminData'
import { getGallery, uploadPhoto, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto } from '../../admin/galleryData'

const mono = { fontFamily: 'Space Grotesk, sans-serif' }

const s = {
  page: {
    minHeight: '100vh',
    background: '#111',
    color: '#eeece8',
    ...mono,
    cursor: 'crosshair',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 2rem',
    borderBottom: '1px solid rgba(238,236,232,0.1)',
    position: 'sticky',
    top: 0,
    background: '#111',
    zIndex: 10,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  tag: { fontSize: '9px', fontWeight: '700', letterSpacing: '0.25em', opacity: 0.35 },
  body: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  section: { marginBottom: '4rem' },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(238,236,232,0.1)',
  },
  sectionTitle: { fontSize: '9px', fontWeight: '700', letterSpacing: '0.25em', opacity: 0.4 },
  btnPrimary: {
    background: '#eeece8',
    border: 'none',
    color: '#111',
    fontSize: '9px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '700',
    letterSpacing: '0.2em',
    padding: '0.55rem 1.25rem',
    cursor: 'crosshair',
  },
  btnGhost: {
    background: 'none',
    border: '1px solid rgba(238,236,232,0.2)',
    color: '#eeece8',
    fontSize: '9px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '600',
    letterSpacing: '0.15em',
    padding: '0.45rem 1rem',
    cursor: 'crosshair',
    transition: 'border-color 0.2s',
  },
  btnDanger: {
    background: 'none',
    border: '1px solid rgba(255,80,80,0.25)',
    color: 'rgba(255,100,100,0.7)',
    fontSize: '9px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '600',
    letterSpacing: '0.15em',
    padding: '0.45rem 1rem',
    cursor: 'crosshair',
    transition: 'all 0.2s',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    fontSize: '8px',
    fontWeight: '700',
    letterSpacing: '0.2em',
    opacity: 0.3,
    textAlign: 'left',
    padding: '0 0.75rem 0.75rem 0',
    borderBottom: '1px solid rgba(238,236,232,0.08)',
  },
  td: {
    fontSize: '12px',
    fontWeight: '300',
    letterSpacing: '0.03em',
    padding: '1rem 0.75rem 1rem 0',
    borderBottom: '1px solid rgba(238,236,232,0.06)',
    verticalAlign: 'middle',
  },
  thumb: {
    width: '48px',
    height: '32px',
    objectFit: 'cover',
    display: 'block',
    background: 'rgba(238,236,232,0.06)',
  },
  inputField: {
    background: 'none',
    border: 'none',
    borderBottom: '1px solid rgba(238,236,232,0.2)',
    color: '#eeece8',
    fontSize: '13px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '300',
    letterSpacing: '0.04em',
    padding: '0.65rem 0',
    outline: 'none',
    cursor: 'text',
    width: '100%',
  },
  formRow: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' },
  label: { fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.35 },
}

function MoveBtn({ dir, onClick }) {
  return (
    <button
      onClick={onClick}
      title={dir === 'up' ? 'Mover para cima' : 'Mover para baixo'}
      style={{
        background: 'none',
        border: 'none',
        color: '#eeece8',
        opacity: 0.4,
        cursor: 'crosshair',
        fontSize: '11px',
        padding: '2px 4px',
        fontFamily: 'monospace',
        lineHeight: 1,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
    >
      {dir === 'up' ? '▲' : '▼'}
    </button>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [contacts, setContacts] = useState({ email: '', instagram: '', instagramUrl: '', phone: '' })
  const [contactsSaved, setContactsSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [gallery, setGallery] = useState([])
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryEditing, setGalleryEditing] = useState(null)
  const [galleryCaption, setGalleryCaption] = useState('')
  const [galleryDeleteConfirm, setGalleryDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin')
      return
    }
    setProjects(getProjects())
    setContacts(getContacts())
    loadGallery()
  }, [])

  const loadGallery = async () => {
    const data = await getGallery()
    setGallery(data.sort((a, b) => (a.order || 0) - (b.order || 0)))
  }

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const moveProject = (index, dir) => {
    const updated = [...projects]
    const swap = dir === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= updated.length) return
    ;[updated[index], updated[swap]] = [updated[swap], updated[index]]
    setProjects(updated)
    saveProjects(updated)
  }

  const deleteProject = (slug) => {
    if (deleteConfirm !== slug) {
      setDeleteConfirm(slug)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }
    const updated = projects.filter(p => p.slug !== slug)
    setProjects(updated)
    saveProjects(updated)
    setDeleteConfirm(null)
  }

  const handleContactsSave = (e) => {
    e.preventDefault()
    saveContacts(contacts)
    setContactsSaved(true)
    setTimeout(() => setContactsSaved(false), 2000)
  }

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setGalleryUploading(true)
    try {
      const uploadResult = await uploadPhoto(file)
      const photo = await addGalleryPhoto({ path: uploadResult.path, caption: '' })
      setGallery(prev => [...prev, photo].sort((a, b) => (a.order || 0) - (b.order || 0)))
    } catch (err) {
      console.error('Gallery upload error:', err)
      alert('Erro ao fazer upload: ' + err.message)
    } finally {
      setGalleryUploading(false)
    }
  }

  const handleGalleryCaption = async (photoId) => {
    try {
      await updateGalleryPhoto(photoId, { caption: galleryCaption })
      setGallery(prev =>
        prev.map(p => p.id === photoId ? { ...p, caption: galleryCaption } : p)
      )
      setGalleryEditing(null)
      setGalleryCaption('')
    } catch (err) {
      console.error('Caption update error:', err)
    }
  }

  const handleGalleryDelete = async (photoId) => {
    if (galleryDeleteConfirm !== photoId) {
      setGalleryDeleteConfirm(photoId)
      setTimeout(() => setGalleryDeleteConfirm(null), 3000)
      return
    }
    try {
      await deleteGalleryPhoto(photoId)
      setGallery(prev => prev.filter(p => p.id !== photoId))
      setGalleryDeleteConfirm(null)
    } catch (err) {
      console.error('Photo delete error:', err)
    }
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="#eeece8" />
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em' }}>BAD TASTE</span>
          <span style={{ ...s.tag, marginLeft: '0.5rem' }}>ADMIN</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{ ...s.btnGhost }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
          >
            VER SITE
          </button>
          <button
            onClick={handleLogout}
            style={{ ...s.btnGhost }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
          >
            SAIR
          </button>
        </div>
      </header>

      <div style={s.body}>
        {/* Projects section */}
        <section style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>PROJETOS — {projects.length}</span>
            <button
              style={s.btnPrimary}
              onClick={() => navigate('/admin/projects/novo')}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              + ADICIONAR
            </button>
          </div>

          {projects.length === 0 ? (
            <p style={{ opacity: 0.3, fontSize: '12px', letterSpacing: '0.05em' }}>Nenhum projeto.</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>ORDEM</th>
                  <th style={s.th}>THUMB</th>
                  <th style={s.th}>TÍTULO</th>
                  <th style={s.th}>SLUG</th>
                  <th style={s.th}>TAGS</th>
                  <th style={s.th}>VÍDEO</th>
                  <th style={s.th}></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.slug}>
                    <td style={{ ...s.td, width: '60px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <MoveBtn dir="up" onClick={() => moveProject(i, 'up')} />
                        <MoveBtn dir="down" onClick={() => moveProject(i, 'down')} />
                      </div>
                    </td>
                    <td style={{ ...s.td, width: '64px' }}>
                      {p.thumbnail
                        ? <img src={p.thumbnail} alt="" style={s.thumb} />
                        : <div style={{ ...s.thumb, opacity: 0.15 }} />
                      }
                    </td>
                    <td style={s.td}>
                      <span style={{ fontWeight: '500' }}>{p.title}</span>
                    </td>
                    <td style={s.td}>
                      <span style={{ opacity: 0.4, fontSize: '11px' }}>{p.slug}</span>
                    </td>
                    <td style={s.td}>
                      <span style={{ opacity: 0.5, fontSize: '11px' }}>{(p.tags || []).join(', ')}</span>
                    </td>
                    <td style={s.td}>
                      <span style={{ opacity: p.videoFull ? 0.5 : 0.2, fontSize: '11px' }}>
                        {p.videoFull ? '✓' : '—'}
                      </span>
                    </td>
                    <td style={{ ...s.td, width: '180px' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          style={s.btnGhost}
                          onClick={() => navigate(`/admin/projects/${p.slug}`)}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
                        >
                          EDITAR
                        </button>
                        <button
                          style={{
                            ...s.btnDanger,
                            ...(deleteConfirm === p.slug ? {
                              background: 'rgba(255,80,80,0.15)',
                              borderColor: 'rgba(255,80,80,0.6)',
                              color: '#ff6b6b',
                            } : {}),
                          }}
                          onClick={() => deleteProject(p.slug)}
                          onMouseEnter={e => {
                            if (deleteConfirm !== p.slug) {
                              e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'
                              e.currentTarget.style.color = 'rgba(255,100,100,1)'
                            }
                          }}
                          onMouseLeave={e => {
                            if (deleteConfirm !== p.slug) {
                              e.currentTarget.style.borderColor = 'rgba(255,80,80,0.25)'
                              e.currentTarget.style.color = 'rgba(255,100,100,0.7)'
                            }
                          }}
                        >
                          {deleteConfirm === p.slug ? 'CONFIRMAR?' : 'APAGAR'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Contacts section */}
        <section style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>CONTACTOS</span>
          </div>
          <form onSubmit={handleContactsSave} style={{ maxWidth: '480px' }}>
            <div style={s.formRow}>
              <label style={s.label}>EMAIL</label>
              <input
                style={s.inputField}
                type="email"
                value={contacts.email}
                onChange={e => setContacts(c => ({ ...c, email: e.target.value }))}
                placeholder="hello@badtaste.pt"
              />
            </div>
            <div style={s.formRow}>
              <label style={s.label}>INSTAGRAM (handle)</label>
              <input
                style={s.inputField}
                type="text"
                value={contacts.instagram}
                onChange={e => setContacts(c => ({ ...c, instagram: e.target.value }))}
                placeholder="@badtaste"
              />
            </div>
            <div style={s.formRow}>
              <label style={s.label}>INSTAGRAM (URL)</label>
              <input
                style={s.inputField}
                type="url"
                value={contacts.instagramUrl}
                onChange={e => setContacts(c => ({ ...c, instagramUrl: e.target.value }))}
                placeholder="https://instagram.com/badtaste"
              />
            </div>
            <div style={s.formRow}>
              <label style={s.label}>TELEMÓVEL</label>
              <input
                style={s.inputField}
                type="text"
                value={contacts.phone}
                onChange={e => setContacts(c => ({ ...c, phone: e.target.value }))}
                placeholder="+351 900 000 000"
              />
            </div>
            <button
              type="submit"
              style={{
                ...s.btnPrimary,
                background: contactsSaved ? '#eeece8' : '#eeece8',
                opacity: contactsSaved ? 0.7 : 1,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {contactsSaved ? 'GUARDADO ✓' : 'GUARDAR'}
            </button>
          </form>
        </section>

        {/* Gallery section */}
        <section style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>GALERIA DE FOTOS — {gallery.length}</span>
            <label style={{ ...s.btnPrimary, display: 'inline-block', marginBottom: 0 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                disabled={galleryUploading}
                style={{ display: 'none' }}
              />
              {galleryUploading ? '+ CARREGANDO...' : '+ ADICIONAR FOTO'}
            </label>
          </div>

          {gallery.length === 0 ? (
            <p style={{ opacity: 0.3, fontSize: '12px', letterSpacing: '0.05em' }}>Nenhuma foto na galeria.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {gallery.map((photo) => (
                <div key={photo.id} style={{ backgroundColor: 'rgba(238,236,232,0.05)', padding: '0.75rem', borderRadius: '4px' }}>
                  <img src={photo.path} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', marginBottom: '0.75rem' }} />
                  <div style={{ fontSize: '11px', marginBottom: '0.5rem' }}>
                    {galleryEditing === photo.id ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <input
                          autoFocus
                          type="text"
                          value={galleryCaption}
                          onChange={e => setGalleryCaption(e.target.value)}
                          placeholder="Caption..."
                          style={{
                            ...s.inputField,
                            fontSize: '11px',
                            padding: '0.25rem 0',
                            marginBottom: 0,
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleGalleryCaption(photo.id)
                            if (e.key === 'Escape') setGalleryEditing(null)
                          }}
                        />
                        <button
                          onClick={() => handleGalleryCaption(photo.id)}
                          style={{ fontSize: '10px', padding: '0.25rem 0.5rem', background: 'rgba(238,236,232,0.2)', border: 'none', color: '#eeece8', cursor: 'pointer' }}
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setGalleryEditing(photo.id)
                          setGalleryCaption(photo.caption || '')
                        }}
                        style={{ cursor: 'pointer', opacity: 0.6, minHeight: '1.2em' }}
                      >
                        {photo.caption || '(sem caption)'}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleGalleryDelete(photo.id)}
                      style={{
                        ...s.btnDanger,
                        flex: 1,
                        padding: '0.35rem',
                        ...(galleryDeleteConfirm === photo.id ? {
                          background: 'rgba(255,80,80,0.15)',
                          borderColor: 'rgba(255,80,80,0.6)',
                          color: '#ff6b6b',
                        } : {}),
                      }}
                      onMouseEnter={e => {
                        if (galleryDeleteConfirm !== photo.id) {
                          e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'
                          e.currentTarget.style.color = 'rgba(255,100,100,1)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (galleryDeleteConfirm !== photo.id) {
                          e.currentTarget.style.borderColor = 'rgba(255,80,80,0.25)'
                          e.currentTarget.style.color = 'rgba(255,100,100,0.7)'
                        }
                      }}
                    >
                      {galleryDeleteConfirm === photo.id ? 'CONFIRMAR?' : 'APAGAR'}
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
