export default function VideoPreview({ project, projectIndex, totalProjects }) {
  const counter = totalProjects > 1
    ? `${String(projectIndex + 1).padStart(2, '0')} / ${String(totalProjects).padStart(2, '0')}`
    : null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '260px',
        background: 'rgba(238, 236, 232, 0.55)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(17, 17, 17, 0.35)',
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease',
        zIndex: 10,
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em' }}>
            {project.title.toUpperCase()}
          </p>
          {counter && (
            <span style={{ fontSize: '10px', color: '#888', letterSpacing: '0.08em', fontWeight: '400' }}>
              {counter}
            </span>
          )}
        </div>
        <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.6 }}>
          {project.description}
        </p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '9px',
                border: '1px solid #111',
                padding: '2px 6px',
                letterSpacing: '0.08em',
              }}
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
