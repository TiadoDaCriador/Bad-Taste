import { useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const CENTER = 350
const SVG_SIZE = CENTER * 2
const R_OUTER = 300
const R_INNER = 245
const NORMAL_SPEED = 0.25
const SLOW_SPEED = 0.015
const GAP_DEG = 1.2 // gap between segments in degrees

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function annularSegmentPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const s1 = polarToCartesian(cx, cy, rOuter, startAngle)
  const e1 = polarToCartesian(cx, cy, rOuter, endAngle)
  const s2 = polarToCartesian(cx, cy, rInner, endAngle)
  const e2 = polarToCartesian(cx, cy, rInner, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ')
}


export default function RotatingWheel({ projects, onHoverChange, externalActivate }) {
  const { t } = useLanguage()
  const rotationRef = useRef(0)
  const speedRef = useRef(NORMAL_SPEED)
  const targetSpeedRef = useRef(NORMAL_SPEED)
  const rafRef = useRef(null)
  const groupRef = useRef(null)

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null) // mobile tap state
  const [isLeaving, setIsLeaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // Highlight segment when returning from a project page
  const [highlightSlug, setHighlightSlug] = useState(location.state?.fromSlug ?? null)
  useEffect(() => {
    if (!highlightSlug) return
    const timer = setTimeout(() => setHighlightSlug(null), 1500)
    // Clear location state so refresh doesn't re-trigger
    window.history.replaceState({}, '')
    return () => clearTimeout(timer)
  }, [highlightSlug])

  const n = projects.length
  const sliceAngle = 360 / n

  const activeIndex = hoveredIndex ?? selectedIndex

  const animate = useCallback(() => {
    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.035
    rotationRef.current += speedRef.current
    if (rotationRef.current >= 360) rotationRef.current -= 360
    if (groupRef.current) {
      groupRef.current.setAttribute('transform', `rotate(${rotationRef.current}, ${CENTER}, ${CENTER})`)
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  // Mount animation: scale(0) → scale(1)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Pause rAF when tab is not visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [animate])

  const goToProject = (slug) => {
    setIsLeaving(true)
    setTimeout(() => navigate(`/projeto/${slug}`), 300)
  }

  // Desktop hover
  const handleMouseEnter = (i) => {
    setHoveredIndex(i)
    targetSpeedRef.current = SLOW_SPEED
    onHoverChange?.(projects[i])
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    targetSpeedRef.current = selectedIndex !== null ? SLOW_SPEED : NORMAL_SPEED
    onHoverChange?.(selectedIndex !== null ? projects[selectedIndex] : null)
  }

  // Mobile touch: first tap selects (preview), second tap navigates
  const handleTouchEnd = (e, i) => {
    e.preventDefault()
    if (selectedIndex === i) {
      goToProject(projects[i].slug)
      setSelectedIndex(null)
      targetSpeedRef.current = NORMAL_SPEED
      onHoverChange?.(null)
    } else {
      setSelectedIndex(i)
      targetSpeedRef.current = SLOW_SPEED
      onHoverChange?.(projects[i])
    }
  }

  // Keyboard: Tab navigates between segments, Enter/Space activates
  const handleKeyDown = (e, i) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      goToProject(projects[i].slug)
    }
  }

  const handleSegmentFocus = (i) => {
    setHoveredIndex(i)
    targetSpeedRef.current = SLOW_SPEED
  }

  const handleSegmentBlur = () => {
    setHoveredIndex(null)
    targetSpeedRef.current = selectedIndex !== null ? SLOW_SPEED : NORMAL_SPEED
    onHoverChange?.(selectedIndex !== null ? projects[selectedIndex] : null)
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      opacity: isLeaving ? 0 : 1,
      transition: 'opacity 0.3s ease',
    }}>
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        style={{
          maxWidth: '82vmin',
          maxHeight: '82vmin',
          overflow: 'visible',
          transform: mounted ? 'scale(1)' : 'scale(0)',
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        aria-label={t.wheel.ariaLabel}
        role="group"
      >
        {/* Defs at SVG root so url(#...) references always resolve */}
        <defs>
          {projects.map((project) =>
            project.thumbnail ? (
              <pattern
                key={project.slug}
                id={`thumb-${project.slug}`}
                patternUnits="userSpaceOnUse"
                x={CENTER - R_OUTER}
                y={CENTER - R_OUTER}
                width={R_OUTER * 2}
                height={R_OUTER * 2}
              >
                <image
                  href={project.thumbnail}
                  x="0"
                  y="0"
                  width={R_OUTER * 2}
                  height={R_OUTER * 2}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            ) : null
          )}
        </defs>

        <g ref={groupRef}>
          {projects.map((project, i) => {
            const startAngle = i * sliceAngle + GAP_DEG / 2
            const endAngle = (i + 1) * sliceAngle - GAP_DEG / 2
            const isActive = activeIndex === i
            const isHighlighted = highlightSlug === project.slug
            const segPath = annularSegmentPath(CENTER, CENTER, R_OUTER, R_INNER, startAngle, endAngle)

            return (
              <g
                key={project.slug}
                role="button"
                aria-label={project.title}
                aria-current={isHighlighted ? 'true' : undefined}
                tabIndex={0}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleSegmentFocus(i)}
                onBlur={handleSegmentBlur}
                onClick={() => goToProject(project.slug)}
                onTouchEnd={(e) => handleTouchEnd(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                style={{ cursor: 'crosshair', outline: 'none' }}
              >
                {/* Segment fill: thumbnail via pattern, or plain beige */}
                <path
                  d={segPath}
                  fill={project.thumbnail ? `url(#thumb-${project.slug})` : '#eeece8'}
                  stroke="none"
                />

                {/* Stroke border */}
                <path
                  d={segPath}
                  fill="transparent"
                  stroke="#111"
                  strokeWidth={isHighlighted && !isActive ? '3' : isActive ? '2' : '1'}
                  style={{ transition: 'stroke-width 0.3s ease' }}
                />
              </g>
            )
          })}
        </g>

        <circle cx={CENTER} cy={CENTER} r={R_OUTER} fill="none" stroke="#111" strokeWidth="1" />
        <circle cx={CENTER} cy={CENTER} r={R_INNER} fill="none" stroke="#111" strokeWidth="1" />
      </svg>

    </div>
  )
}
