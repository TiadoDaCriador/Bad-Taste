import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isAuthenticated } from '../../admin/adminAuth'
import { getProjects, saveProjects, slugify } from '../../admin/adminData'
import { uploadPhoto, uploadVideo } from '../../admin/galleryData'

const emptyProject = {
  title: '',
  slug: '',
  color: '#111111',
  videoFull: '',
  previewStart: 0,
  videoPreview: '',
  thumbnail: '',
  description: '',
  tags: '',
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#1a1a1a',
    color: '#eeece8',
    fontFamily: 'Space Grotesk, sans-serif',
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
    background: '#1a1a1a',
    zIndex: 10,
  },
  body: { maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem 6rem' },
  title: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.4 },
  formRow: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' },
  label: { fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.35 },
  hint: { fontSize: '9px', letterSpacing: '0.05em', opacity: 0.25, marginTop: '0.35rem' },
  input: {
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
    width: '100%',
    transition: 'border-color 0.2s',
  },
  textarea: {
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
    width: '100%',
    resize: 'none',
    lineHeight: '1.7',
  },
  divider: {
    borderTop: '1px solid rgba(238,236,232,0.08)',
    margin: '2.5rem 0',
  },
  sectionLabel: {
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '0.25em',
    opacity: 0.25,
    marginBottom: '1.75rem',
    display: 'block',
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
  btnPrimary: {
    background: '#eeece8',
    border: 'none',
    color: '#111',
    fontSize: '10px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '700',
    letterSpacing: '0.2em',
    padding: '0.85rem 2rem',
    cursor: 'crosshair',
    transition: 'opacity 0.2s',
  },
  btnGhost: {
    background: 'none',
    border: '1px solid rgba(238,236,232,0.2)',
    color: '#eeece8',
    fontSize: '10px',
    fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: '600',
    letterSpacing: '0.15em',
    padding: '0.85rem 2rem',
    cursor: 'crosshair',
    transition: 'border-color 0.2s',
  },
}

export default function AdminProjectEditor() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const isNew = slug === 'novo'

  const [form, setForm] = useState(emptyProject)
  const [slugManual, setSlugManual] = useState(false)
  const [focused, setFocused] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState({ thumbnail: false, videoFull: false, videoPreview: false })

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/admin'); return }
    if (!isNew) {
      (async () => {
        const projects = await getProjects()
        const found = projects.find(p => p.slug === slug)
        if (!found) { navigate('/admin/dashboard'); return }
        setForm({
          ...found,
          tags: (found.tags || []).join(', '),
          videoPreview: found.videoPreview || '',
        })
        setSlugManual(true)
      })()
    }
  }, [slug])

  const set = (key) => (e) => {
    const val = e.target.value
    setForm(f => {
      const next = { ...f, [key]: val }
      if (key === 'title' && !slugManual) {
        next.slug = slugify(val)
      }
      return next
    })
  }

  const inputStyle = (field) => ({
    ...s.input,
    borderBottomColor: focused === field
      ? 'rgba(238,236,232,0.7)'
      : 'rgba(238,236,232,0.2)',
  })

  const handleFileUpload = async (e, field, uploadFn) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(u => ({ ...u, [field]: true }))
    try {
      const result = await uploadFn(file)
      setForm(f => ({ ...f, [field]: result.path }))
    } catch (err) {
      setError(`Erro ao fazer upload do ficheiro: ${err.message}`)
      console.error(err)
    } finally {
      setUploading(u => ({ ...u, [field]: false }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) { setError('O título é obrigatório.'); return }
    if (!form.slug.trim()) { setError('O slug é obrigatório.'); return }

    const projects = await getProjects()
    const tagsArray = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const project = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      color: form.color || '#111111',
      videoFull: form.videoFull.trim(),
      previewStart: Number(form.previewStart) || 0,
      videoPreview: form.videoPreview.trim() || null,
      thumbnail: form.thumbnail.trim() || null,
      description: form.description.trim(),
      tags: tagsArray,
    }

    let updated
    if (isNew) {
      if (projects.find(p => p.slug === project.slug)) {
        setError(`Já existe um projeto com o slug "${project.slug}".`)
        return
      }
      updated = [...projects, project]
    } else {
      updated = projects.map(p => p.slug === slug ? project : p)
    }

    await saveProjects(updated)
    navigate('/admin/dashboard')
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" fill="#eeece8" />
            <text x="5" y="25" fontFamily="Space Grotesk, sans-serif" fontSize="16" fontWeight="700" letterSpacing="1" fill="#111">BT</text>
          </svg>
          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em' }}>ADMIN</span>
          <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.35, marginLeft: '0.5rem' }}>
            {isNew ? 'NOVO PROJETO' : 'EDITAR PROJETO'}
          </span>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          style={s.btnGhost}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
        >
          ← VOLTAR
        </button>
      </header>

      <div style={s.body}>
        <form onSubmit={handleSubmit}>
          {/* Base info */}
          <span style={s.sectionLabel}>INFORMAÇÃO BASE</span>

          <div style={s.formRow}>
            <label style={s.label}>TÍTULO *</label>
            <input
              style={inputStyle('title')}
              value={form.title}
              onChange={set('title')}
              onFocus={() => setFocused('title')}
              onBlur={() => setFocused(null)}
              placeholder="Nome do projeto"
            />
          </div>

          <div style={s.row2}>
            <div style={s.formRow}>
              <label style={s.label}>SLUG *</label>
              <input
                style={inputStyle('slug')}
                value={form.slug}
                onChange={e => { setSlugManual(true); set('slug')(e) }}
                onFocus={() => setFocused('slug')}
                onBlur={() => setFocused(null)}
                placeholder="nome-do-projeto"
              />
              <span style={s.hint}>Gerado automaticamente. URL: /projeto/{form.slug || '...'}</span>
            </div>
            <div style={s.formRow}>
              <label style={s.label}>COR (reservada)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem' }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={set('color')}
                  style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'crosshair', padding: 0 }}
                />
                <span style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.05em' }}>{form.color}</span>
              </div>
            </div>
          </div>

          <div style={s.formRow}>
            <label style={s.label}>DESCRIÇÃO</label>
            <textarea
              style={{ ...s.textarea, borderBottomColor: focused === 'description' ? 'rgba(238,236,232,0.7)' : 'rgba(238,236,232,0.2)' }}
              value={form.description}
              onChange={set('description')}
              onFocus={() => setFocused('description')}
              onBlur={() => setFocused(null)}
              rows={3}
              placeholder="Descrição curta do projeto..."
            />
          </div>

          <div style={s.formRow}>
            <label style={s.label}>TAGS</label>
            <input
              style={inputStyle('tags')}
              value={form.tags}
              onChange={set('tags')}
              onFocus={() => setFocused('tags')}
              onBlur={() => setFocused(null)}
              placeholder="Identidade, Motion, Print"
            />
            <span style={s.hint}>Separadas por vírgula</span>
          </div>

          <div style={s.divider} />

          {/* Assets */}
          <span style={s.sectionLabel}>ASSETS</span>

          <div style={s.formRow}>
            <label style={s.label}>THUMBNAIL</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileUpload(e, 'thumbnail', uploadPhoto)}
                disabled={uploading.thumbnail}
                style={{
                  fontSize: '11px',
                  cursor: 'pointer',
                  opacity: 0.7,
                }}
              />
              {uploading.thumbnail && <span style={{ fontSize: '11px', opacity: 0.5 }}>A carregar...</span>}
            </div>
            <span style={s.hint}>Ou colar o path manualmente:</span>
            <input
              style={inputStyle('thumbnail')}
              value={form.thumbnail}
              onChange={set('thumbnail')}
              onFocus={() => setFocused('thumbnail')}
              onBlur={() => setFocused(null)}
              placeholder="/images/projeto-thumb.jpg"
            />
          </div>

          {form.thumbnail && (
            <div style={{ marginBottom: '2rem', marginTop: '-0.5rem' }}>
              <img
                src={form.thumbnail}
                alt=""
                style={{ height: '80px', objectFit: 'cover', opacity: 0.7, display: 'block' }}
                onError={e => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}

          <div style={s.formRow}>
            <label style={s.label}>VÍDEO COMPLETO</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <input
                type="file"
                accept="video/*"
                onChange={e => handleFileUpload(e, 'videoFull', uploadVideo)}
                disabled={uploading.videoFull}
                style={{
                  fontSize: '11px',
                  cursor: 'pointer',
                  opacity: 0.7,
                }}
              />
              {uploading.videoFull && <span style={{ fontSize: '11px', opacity: 0.5 }}>A carregar...</span>}
            </div>
            <span style={s.hint}>Ou colar o path manualmente:</span>
            <input
              style={inputStyle('videoFull')}
              value={form.videoFull}
              onChange={set('videoFull')}
              onFocus={() => setFocused('videoFull')}
              onBlur={() => setFocused(null)}
              placeholder="/videos/full/video.mp4"
            />
          </div>

          <div style={s.row2}>
            <div style={s.formRow}>
              <label style={s.label}>PREVIEW START (segundos)</label>
              <input
                style={inputStyle('previewStart')}
                type="number"
                min="0"
                value={form.previewStart}
                onChange={set('previewStart')}
                onFocus={() => setFocused('previewStart')}
                onBlur={() => setFocused(null)}
                placeholder="0"
              />
              <span style={s.hint}>Segundo a partir do qual inicia o clip de 20s</span>
            </div>
            <div style={s.formRow}>
              <label style={s.label}>VÍDEO PREVIEW (opcional)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <input
                  type="file"
                  accept="video/*"
                  onChange={e => handleFileUpload(e, 'videoPreview', uploadVideo)}
                  disabled={uploading.videoPreview}
                  style={{
                    fontSize: '11px',
                    cursor: 'pointer',
                    opacity: 0.7,
                  }}
                />
                {uploading.videoPreview && <span style={{ fontSize: '11px', opacity: 0.5 }}>A carregar...</span>}
              </div>
              <span style={s.hint}>Ou colar o path manualmente:</span>
              <input
                style={inputStyle('videoPreview')}
                value={form.videoPreview}
                onChange={set('videoPreview')}
                onFocus={() => setFocused('videoPreview')}
                onBlur={() => setFocused(null)}
                placeholder="/videos/preview/clip.mp4"
              />
              <span style={s.hint}>Se definido, sobrepõe o clip automático</span>
            </div>
          </div>

          <div style={s.divider} />

          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '11px', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              style={s.btnPrimary}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {isNew ? 'CRIAR PROJETO' : 'GUARDAR ALTERAÇÕES'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              style={s.btnGhost}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(238,236,232,0.2)'}
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
