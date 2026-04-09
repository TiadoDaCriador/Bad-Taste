import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, logout, changePassword } from '../../admin/adminAuth'
import { getProjects, saveProjects, getContacts, saveContacts } from '../../admin/adminData'
import { getPhotoProjects, createPhotoProject, savePhotoProjects, deletePhotoProject, slugify } from '../../admin/photoProjectsData'
import { getSlideshow, addImageToSlideshow, reorderSlideshow, removeImageFromSlideshow } from '../../admin/slideshowData'
import { uploadPhoto } from '../../admin/galleryData'

const mono = { fontFamily: 'Space Grotesk, sans-serif' }

const s = {
  page: {
    minHeight: '100vh',
    background: '#1a1a1a',
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
    background: '#1a1a1a',
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
  const [photoProjects, setPhotoProjects] = useState([])
  const [slideshow, setSlideshow] = useState([])
  const [contacts, setContacts] = useState({ email: '', instagram: '', instagramUrl: '', phone: '' })
  const [contactsSaved, setContactsSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [photoProjDeleteConfirm, setPhotoProjDeleteConfirm] = useState(null)
  const [newPhotoTitle, setNewPhotoTitle] = useState('')
  const [creatingPhotoProj, setCreatingPhotoProj] = useState(false)
  const [slideshowUploading, setSlideshowUploading] = useState(false)
  const [slideshowDeleteConfirm, setSlideshowDeleteConfirm] = useState(null)
  const [pwdCurrent, setPwdCurrent] = useState('')
  const [pwdNew, setPwdNew] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const [pwdMsg, setPwdMsg] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin')
      return
    }
    getProjects().then(setProjects)
    getPhotoProjects().then(setPhotoProjects)
    getSlideshow().then(setSlideshow)
    getContacts().then(setContacts)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const moveProject = async (index, dir) => {
    const updated = [...projects]
    const swap = dir === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= updated.length) return
    ;[updated[index], updated[swap]] = [updated[swap], updated[index]]
    setProjects(updated)
    await saveProjects(updated)
  }

  const deleteProject = async (slug) => {
    if (deleteConfirm !== slug) {
      setDeleteConfirm(slug)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }
    const updated = projects.filter(p => p.slug !== slug)
    setProjects(updated)
    await saveProjects(updated)
    setDeleteConfirm(null)
  }

  const handleContactsSave = async (e) => {
    e.preventDefault()
    await saveContacts(contacts)
    setContactsSaved(true)
    setTimeout(() => setContactsSaved(false), 2000)
  }

  const movePhotoProject = async (index, dir) => {
    const updated = [...photoProjects]
    const swap = dir === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= updated.length) return
    ;[updated[index], updated[swap]] = [updated[swap], updated[index]]
    setPhotoProjects(updated)
    await savePhotoProjects(updated)
  }

  const deletePhotoProj = async (slug) => {
    if (photoProjDeleteConfirm !== slug) {
      setPhotoProjDeleteConfirm(slug)
      setTimeout(() => setPhotoProjDeleteConfirm(null), 3000)
      return
    }
    await deletePhotoProject(slug)
    setPhotoProjects(prev => prev.filter(p => p.slug !== slug))
    setPhotoProjDeleteConfirm(null)
  }

  const createPhotoProj = async (e) => {
    e.preventDefault()
    if (!newPhotoTitle.trim()) return
    setCreatingPhotoProj(true)
    try {
      const slug = slugify(newPhotoTitle)
      await createPhotoProject({ slug, title: newPhotoTitle })
      const updated = await getPhotoProjects()
      setPhotoProjects(updated)
      setNewPhotoTitle('')
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setCreatingPhotoProj(false)
    }
  }

  const handleSlideshowUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSlideshowUploading(true)
    try {
      const uploadResult = await uploadPhoto(file)
      await addImageToSlideshow(uploadResult.path)
      const updated = await getSlideshow()
      setSlideshow(updated)
    } catch (err) {
      alert('Erro no upload: ' + err.message)
    } finally {
      setSlideshowUploading(false)
    }
  }

  const handleSlideshowDelete = async (id) => {
    if (slideshowDeleteConfirm !== id) {
      setSlideshowDeleteConfirm(id)
      setTimeout(() => setSlideshowDeleteConfirm(null), 3000)
      return
    }
    try {
      await removeImageFromSlideshow(id)
      setSlideshow(prev => prev.filter(img => img.id !== id))
      setSlideshowDeleteConfirm(null)
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  const moveSlideshowImage = async (index, dir) => {
    const updated = [...slideshow]
    const swap = dir === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= updated.length) return
    ;[updated[index], updated[swap]] = [updated[swap], updated[index]]
    setSlideshow(updated)
    await reorderSlideshow(updated)
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

        {/* Photo Projects section */}
        <section style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>PROJETOS DE FOTOS — {photoProjects.length}</span>
            <button
              style={s.btnPrimary}
              onClick={() => setCreatingPhotoProj(!creatingPhotoProj)}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              + ADICIONAR
            </button>
          </div>

          {creatingPhotoProj && (
            <form onSubmit={createPhotoProj} style={{ maxWidth: '480px', marginBottom: '2rem', padding: 'clamp(1rem, 2vw, 1.5rem)', background: 'rgba(238,236,232,0.05)', border: '1px solid rgba(238,236,232,0.1)' }}>
              <div style={s.formRow}>
                <label style={s.label}>TÍTULO DO PROJETO</label>
                <input
                  autoFocus
                  style={s.inputField}
                  type="text"
                  value={newPhotoTitle}
                  onChange={e => setNewPhotoTitle(e.target.value)}
                  placeholder="Ex: Paisagens, Retratos..."
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={s.btnPrimary} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>CRIAR</button>
                <button type="button" style={s.btnGhost} onClick={() => setCreatingPhotoProj(false)} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}>CANCELAR</button>
              </div>
            </form>
          )}

          {photoProjects.length === 0 ? (
            <p style={{ opacity: 0.3, fontSize: 'clamp(11px, 1.5vw, 12px)', letterSpacing: '0.05em' }}>Nenhum projeto de fotos.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>ORDEM</th>
                    <th style={s.th}>THUMB</th>
                    <th style={s.th}>TÍTULO</th>
                    <th style={s.th}>SLUG</th>
                    <th style={s.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {photoProjects.map((p, i) => (
                    <tr key={p.slug}>
                      <td style={{ ...s.td, width: 'clamp(50px, 10vw, 80px)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <MoveBtn dir="up" onClick={() => movePhotoProject(i, 'up')} />
                          <MoveBtn dir="down" onClick={() => movePhotoProject(i, 'down')} />
                        </div>
                      </td>
                      <td style={{ ...s.td, width: 'clamp(50px, 10vw, 80px)' }}>
                        {p.thumbnail ? <img src={p.thumbnail} alt="" style={s.thumb} /> : <div style={{ ...s.thumb, opacity: 0.15 }} />}
                      </td>
                      <td style={s.td}>
                        <span style={{ fontWeight: '500' }}>{p.title}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ opacity: 0.4, fontSize: 'clamp(10px, 1.2vw, 11px)' }}>{p.slug}</span>
                      </td>
                      <td style={{ ...s.td, width: 'clamp(140px, 25vw, 200px)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            style={s.btnGhost}
                            onClick={() => navigate(`/admin/photo-projects/${p.slug}`)}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
                          >
                            EDITAR
                          </button>
                          <button
                            style={{
                              ...s.btnDanger,
                              ...(photoProjDeleteConfirm === p.slug ? { background: 'rgba(255,80,80,0.15)', borderColor: 'rgba(255,80,80,0.6)', color: '#ff6b6b' } : {}),
                            }}
                            onClick={() => deletePhotoProj(p.slug)}
                            onMouseEnter={e => { if (photoProjDeleteConfirm !== p.slug) { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'; e.currentTarget.style.color = 'rgba(255,100,100,1)' } }}
                            onMouseLeave={e => { if (photoProjDeleteConfirm !== p.slug) { e.currentTarget.style.borderColor = 'rgba(255,80,80,0.25)'; e.currentTarget.style.color = 'rgba(255,100,100,0.7)' } }}
                          >
                            {photoProjDeleteConfirm === p.slug ? 'CONFIRMAR?' : 'APAGAR'}
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

        {/* Slideshow section */}
        <section style={s.section}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>IMAGENS DE FUNDO (SLIDESHOW) — {slideshow.length}</span>
            <label style={{ ...s.btnPrimary, display: 'inline-block', marginBottom: 0, cursor: 'crosshair' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleSlideshowUpload}
                disabled={slideshowUploading}
                style={{ display: 'none' }}
              />
              {slideshowUploading ? '+ CARREGANDO...' : '+ ADICIONAR IMAGEM'}
            </label>
          </div>

          {slideshow.length === 0 ? (
            <p style={{ opacity: 0.3, fontSize: 'clamp(11px, 1.5vw, 12px)', letterSpacing: '0.05em' }}>Nenhuma imagem no slideshow.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 20vw, 200px), 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
              marginTop: '1.5rem'
            }}>
              {slideshow.map((img, idx) => (
                <div
                  key={img.id}
                  style={{
                    backgroundColor: 'rgba(238,236,232,0.05)',
                    border: '1px solid rgba(238,236,232,0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
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
                  <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
                    <img
                      src={img.path}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                  <div style={{ padding: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                    <p style={{ fontSize: '8px', letterSpacing: '0.15em', opacity: 0.4, margin: 0, marginBottom: '0.5rem', fontWeight: '700' }}>
                      {String(idx + 1).padStart(2, '0')} / {String(slideshow.length).padStart(2, '0')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', paddingTop: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                      <button
                        onClick={() => moveSlideshowImage(idx, 'up')}
                        disabled={idx === 0}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#eeece8',
                          opacity: idx === 0 ? 0.15 : 0.4,
                          cursor: idx === 0 ? 'default' : 'crosshair',
                          fontSize: '10px',
                          padding: '2px 4px',
                          fontFamily: 'monospace',
                          lineHeight: 1,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => { if (idx !== 0) e.currentTarget.style.opacity = '1' }}
                        onMouseLeave={e => { if (idx !== 0) e.currentTarget.style.opacity = '0.4' }}
                      >▲</button>
                      <button
                        onClick={() => moveSlideshowImage(idx, 'down')}
                        disabled={idx === slideshow.length - 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#eeece8',
                          opacity: idx === slideshow.length - 1 ? 0.15 : 0.4,
                          cursor: idx === slideshow.length - 1 ? 'default' : 'crosshair',
                          fontSize: '10px',
                          padding: '2px 4px',
                          fontFamily: 'monospace',
                          lineHeight: 1,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => { if (idx !== slideshow.length - 1) e.currentTarget.style.opacity = '1' }}
                        onMouseLeave={e => { if (idx !== slideshow.length - 1) e.currentTarget.style.opacity = '0.4' }}
                      >▼</button>
                    </div>
                    <button
                      onClick={() => handleSlideshowDelete(img.id)}
                      style={{
                        ...s.btnDanger,
                        flex: 1,
                        padding: 'clamp(0.3rem, 1vw, 0.35rem)',
                        fontSize: 'clamp(8px, 1.2vw, 9px)',
                        ...(slideshowDeleteConfirm === img.id ? {
                          background: 'rgba(255,80,80,0.15)',
                          borderColor: 'rgba(255,80,80,0.6)',
                          color: '#ff6b6b',
                        } : {}),
                      }}
                      onMouseEnter={e => {
                        if (slideshowDeleteConfirm !== img.id) {
                          e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'
                          e.currentTarget.style.color = 'rgba(255,100,100,1)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (slideshowDeleteConfirm !== img.id) {
                          e.currentTarget.style.borderColor = 'rgba(255,80,80,0.25)'
                          e.currentTarget.style.color = 'rgba(255,100,100,0.7)'
                        }
                      }}
                    >
                      {slideshowDeleteConfirm === img.id ? 'CONFIRMAR?' : 'APAGAR'}
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
