import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, logout, changePassword } from '../../admin/adminAuth'
import { getProjects, saveProjects, getContacts, saveContacts } from '../../admin/adminData'
import { getGallery, uploadPhoto, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto, setCoverPhoto } from '../../admin/galleryData'

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
    padding: 'clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 2rem)',
    borderBottom: '1px solid rgba(238,236,232,0.1)',
    position: 'sticky',
    top: 0,
    background: '#111',
    zIndex: 10,
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 'clamp(6px, 2vw, 10px)', minWidth: 'fit-content' },
  tag: { fontSize: 'clamp(7px, 1.5vw, 9px)', fontWeight: '700', letterSpacing: '0.25em', opacity: 0.35 },
  body: { maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)' },
  section: { marginBottom: '4rem' },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(238,236,232,0.1)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  sectionTitle: { fontSize: 'clamp(8px, 1.5vw, 9px)', fontWeight: '700', letterSpacing: '0.25em', opacity: 0.4 },
  btnPrimary: {
    background: '#eeece8',
    border: 'none',
    color: '#111',
    fontSize: 'clamp(8px, 1.5vw, 9px)',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '700',
    letterSpacing: '0.2em',
    padding: 'clamp(0.4rem, 1vw, 0.55rem) clamp(0.8rem, 2vw, 1.25rem)',
    cursor: 'crosshair',
    transition: 'opacity 0.2s',
  },
  btnGhost: {
    background: 'none',
    border: '1px solid rgba(238,236,232,0.2)',
    color: '#eeece8',
    fontSize: 'clamp(8px, 1.5vw, 9px)',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '600',
    letterSpacing: '0.15em',
    padding: 'clamp(0.35rem, 1vw, 0.45rem) clamp(0.7rem, 1.5vw, 1rem)',
    cursor: 'crosshair',
    transition: 'all 0.2s',
  },
  btnDanger: {
    background: 'none',
    border: '1px solid rgba(255,80,80,0.25)',
    color: 'rgba(255,100,100,0.7)',
    fontSize: 'clamp(8px, 1.5vw, 9px)',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '600',
    letterSpacing: '0.15em',
    padding: 'clamp(0.35rem, 1vw, 0.45rem) clamp(0.7rem, 1.5vw, 1rem)',
    cursor: 'crosshair',
    transition: 'all 0.2s',
  },
  table: { width: '100%', borderCollapse: 'collapse', overflowX: 'auto' },
  th: {
    fontSize: 'clamp(7px, 1.2vw, 8px)',
    fontWeight: '700',
    letterSpacing: '0.2em',
    opacity: 0.3,
    textAlign: 'left',
    padding: 'clamp(0.4rem, 1vw, 0.75rem)',
    borderBottom: '1px solid rgba(238,236,232,0.08)',
  },
  td: {
    fontSize: 'clamp(11px, 1.5vw, 12px)',
    fontWeight: '300',
    letterSpacing: '0.03em',
    padding: 'clamp(0.75rem, 1.5vw, 1rem)',
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
    fontSize: 'clamp(12px, 1.5vw, 13px)',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '300',
    letterSpacing: '0.04em',
    padding: 'clamp(0.5rem, 1vw, 0.65rem) 0',
    outline: 'none',
    cursor: 'text',
    width: '100%',
  },
  formRow: { display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 1vw, 0.5rem)', marginBottom: 'clamp(1.2rem, 3vw, 1.75rem)' },
  label: { fontSize: 'clamp(8px, 1.2vw, 9px)', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.35 },
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
  const [pwdCurrent, setPwdCurrent] = useState('')
  const [pwdNew, setPwdNew] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const [pwdMsg, setPwdMsg] = useState(null)

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

  const handleSetCover = async (photoId) => {
    try {
      await setCoverPhoto(photoId)
      setGallery(prev => prev.map(p => ({ ...p, isCover: p.id === photoId })))
    } catch (err) {
      console.error('Set cover error:', err)
    }
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (pwdNew !== pwdConfirm) {
      setPwdMsg({ ok: false, text: 'As novas palavras-passe não coincidem' })
      return
    }
    const result = changePassword(pwdCurrent, pwdNew)
    if (result.success) {
      setPwdMsg({ ok: true, text: 'Palavra-passe alterada com sucesso' })
      setPwdCurrent('')
      setPwdNew('')
      setPwdConfirm('')
    } else {
      setPwdMsg({ ok: false, text: result.error })
    }
    setTimeout(() => setPwdMsg(null), 3000)
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
            <p style={{ opacity: 0.3, fontSize: 'clamp(11px, 1.5vw, 12px)', letterSpacing: '0.05em' }}>Nenhum projeto.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
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
                      <td style={{ ...s.td, width: 'clamp(50px, 10vw, 80px)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <MoveBtn dir="up" onClick={() => moveProject(i, 'up')} />
                          <MoveBtn dir="down" onClick={() => moveProject(i, 'down')} />
                        </div>
                      </td>
                      <td style={{ ...s.td, width: 'clamp(50px, 10vw, 80px)' }}>
                        {p.thumbnail
                          ? <img src={p.thumbnail} alt="" style={s.thumb} />
                          : <div style={{ ...s.thumb, opacity: 0.15 }} />
                        }
                      </td>
                      <td style={s.td}>
                        <span style={{ fontWeight: '500' }}>{p.title}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ opacity: 0.4, fontSize: 'clamp(10px, 1.2vw, 11px)' }}>{p.slug}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ opacity: 0.5, fontSize: 'clamp(10px, 1.2vw, 11px)' }}>{(p.tags || []).join(', ')}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ opacity: p.videoFull ? 0.5 : 0.2, fontSize: 'clamp(10px, 1.2vw, 11px)' }}>
                          {p.videoFull ? '✓' : '—'}
                        </span>
                      </td>
                      <td style={{ ...s.td, width: 'clamp(140px, 25vw, 200px)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
            </div>
          )}
        </section>

        {/* Gallery section */}
        <section style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>GALERIA DE FOTOS — {gallery.length}</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
              <button
                style={s.btnGhost}
                onClick={() => window.open('/fotos', '_blank')}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
              >
                VER GALERIA
              </button>
            </div>
          </div>

          {gallery.length === 0 ? (
            <p style={{ opacity: 0.3, fontSize: 'clamp(11px, 1.5vw, 12px)', letterSpacing: '0.05em' }}>Nenhuma foto na galeria.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 20vw, 200px), 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
              marginTop: '1.5rem'
            }}>
              {gallery.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    backgroundColor: 'rgba(238,236,232,0.05)',
                    border: '1px solid rgba(238,236,232,0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(238,236,232,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(238,236,232,0.3)'
                    e.currentTarget.style.transform = 'scale(1.02)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(238,236,232,0.05)'
                    e.currentTarget.style.borderColor = 'rgba(238,236,232,0.1)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1' }}>
                    <img
                      src={photo.path}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'filter 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.85)'}
                      onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                    />
                  </div>
                  <div style={{ padding: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                    {photo.isCover && (
                      <p style={{ fontSize: '8px', letterSpacing: '0.15em', opacity: 0.4, marginBottom: '0.35rem', fontWeight: '700' }}>
                        ★ NOME VISÍVEL NA PÁGINA FOTOS
                      </p>
                    )}
                    {galleryEditing === photo.id ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <input
                          autoFocus
                          type="text"
                          value={galleryCaption}
                          onChange={e => setGalleryCaption(e.target.value)}
                          placeholder="Nome / caption..."
                          style={{
                            ...s.inputField,
                            fontSize: 'clamp(10px, 1.2vw, 11px)',
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
                          style={{
                            fontSize: 'clamp(9px, 1.2vw, 10px)',
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(238,236,232,0.2)',
                            border: 'none',
                            color: '#eeece8',
                            cursor: 'pointer',
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: '600',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(238,236,232,0.4)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(238,236,232,0.2)'}
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
                        style={{
                          cursor: 'pointer',
                          opacity: 0.6,
                          minHeight: '1.2em',
                          fontSize: 'clamp(10px, 1.2vw, 11px)',
                          transition: 'opacity 0.2s',
                          wordBreak: 'break-word'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                      >
                        {photo.caption || '(sem nome)'}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', paddingTop: 0 }}>
                    <button
                      onClick={() => handleSetCover(photo.id)}
                      title={photo.isCover ? 'Foto de capa atual' : 'Definir como capa'}
                      style={{
                        ...s.btnGhost,
                        flex: 1,
                        padding: 'clamp(0.3rem, 1vw, 0.35rem)',
                        fontSize: 'clamp(8px, 1.2vw, 9px)',
                        ...(photo.isCover ? {
                          background: 'rgba(238,236,232,0.15)',
                          borderColor: 'rgba(238,236,232,0.6)',
                        } : {}),
                      }}
                      onMouseEnter={e => { if (!photo.isCover) e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)' }}
                      onMouseLeave={e => { if (!photo.isCover) e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)' }}
                    >
                      {photo.isCover ? '★ CAPA' : '☆ CAPA'}
                    </button>
                    <button
                      onClick={() => handleGalleryDelete(photo.id)}
                      style={{
                        ...s.btnDanger,
                        flex: 1,
                        padding: 'clamp(0.3rem, 1vw, 0.35rem)',
                        fontSize: 'clamp(8px, 1.2vw, 9px)',
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

        {/* Password section */}
        <section style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>SEGURANÇA — ALTERAR PALAVRA-PASSE</span>
          </div>
          <form onSubmit={handlePasswordChange} style={{ maxWidth: '480px' }}>
            <div style={s.formRow}>
              <label style={s.label}>PALAVRA-PASSE ATUAL</label>
              <input
                style={s.inputField}
                type="password"
                value={pwdCurrent}
                onChange={e => setPwdCurrent(e.target.value)}
                placeholder="Palavra-passe atual..."
                autoComplete="current-password"
              />
            </div>
            <div style={s.formRow}>
              <label style={s.label}>NOVA PALAVRA-PASSE</label>
              <input
                style={s.inputField}
                type="password"
                value={pwdNew}
                onChange={e => setPwdNew(e.target.value)}
                placeholder="Mínimo 6 caracteres..."
                autoComplete="new-password"
              />
            </div>
            <div style={s.formRow}>
              <label style={s.label}>CONFIRMAR NOVA PALAVRA-PASSE</label>
              <input
                style={s.inputField}
                type="password"
                value={pwdConfirm}
                onChange={e => setPwdConfirm(e.target.value)}
                placeholder="Repetir nova palavra-passe..."
                autoComplete="new-password"
              />
            </div>
            {pwdMsg && (
              <p style={{
                fontSize: 'clamp(10px, 1.2vw, 11px)',
                letterSpacing: '0.05em',
                color: pwdMsg.ok ? 'rgba(100,220,100,0.9)' : 'rgba(255,100,100,0.9)',
                marginBottom: '1rem',
              }}>
                {pwdMsg.text}
              </p>
            )}
            <button
              type="submit"
              style={s.btnPrimary}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              ALTERAR PALAVRA-PASSE
            </button>
          </form>
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
      </div>
    </div>
  )
}
