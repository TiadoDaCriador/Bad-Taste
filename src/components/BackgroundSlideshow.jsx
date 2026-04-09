import { useState, useEffect, useRef } from 'react'
import { getSlideshow } from '../admin/slideshowData'

const FALLBACK_IMAGES = [
  '/images/1769655142724-950339847.png',
  '/images/1769655142730-235461476.png',
  '/images/1769655170100-787475231.PNG',
  '/images/1769655170104-328748182.png',
  '/images/1769655170109-862902314.png',
  '/images/1769655170116-565796983.png',
  '/images/1769655170119-362779387.png',
  '/images/1769655170123-146631469.png',
  '/images/1769655170128-299223567.png',
  '/images/1769656196869-469110749.png',
  '/images/1769656309539-230799152.png',
  '/images/1770268684737-515546375.png',
  '/images/1770268684764-981218381.png',
  '/images/1770268684777-806588143.png',
  '/images/1770268684784-409494920.png',
  '/images/1770268684786-139958444.png',
]

const SHOW_DURATION = 3000 // ms entre transições
const FADE_DURATION = 900  // ms do crossfade
const CLIP_DURATION = 20   // segundos de clip de preview

export default function BackgroundSlideshow({ paused, videoProject }) {
  const [images, setImages] = useState([])
  // Dois slots que alternam: um visível (opacity 1), outro carregado mas invisível (opacity 0)
  const [slots, setSlots] = useState([
    { src: FALLBACK_IMAGES[0], opacity: 1, zIndex: 1 },
    { src: FALLBACK_IMAGES[1], opacity: 0, zIndex: 0 },
  ])
  const imagesRef = useRef([])
  const activeSlotRef = useRef(0) // qual slot está actualmente visível
  const nextIdxRef = useRef(2)    // próxima imagem a mostrar
  const pausedRef = useRef(paused)
  const videoRef = useRef(null)

  // Carregar imagens do slideshow da API
  useEffect(() => {
    getSlideshow().then(imgs => {
      const paths = imgs.map(img => img.path)
      imagesRef.current = paths
      setImages(paths)
      // Reinicializar slots com as novas imagens
      if (paths.length > 0) {
        setSlots([
          { src: paths[0], opacity: 1, zIndex: 1 },
          { src: paths[1] || paths[0], opacity: 0, zIndex: 0 },
        ])
      } else {
        setSlots([
          { src: '', opacity: 1, zIndex: 1 },
          { src: '', opacity: 0, zIndex: 0 },
        ])
      }
    })
  }, [])

  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    // Só inicia o interval se há imagens
    if (imagesRef.current.length === 0) return

    const id = setInterval(() => {
      if (pausedRef.current) return

      const active = activeSlotRef.current
      const incoming = 1 - active
      const nextImg = imagesRef.current[nextIdxRef.current % imagesRef.current.length]
      nextIdxRef.current++
      activeSlotRef.current = incoming

      setSlots(prev => {
        const newSlots = [...prev]
        newSlots[incoming] = { src: nextImg, opacity: 1, zIndex: 2 }
        newSlots[active] = { ...prev[active], opacity: 0, zIndex: 1 }
        return newSlots
      })
    }, SHOW_DURATION)

    return () => clearInterval(id)
  }, [images.length])

  // Lógica do vídeo de preview no fundo
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!videoProject?.videoFull) return

    const startTime = videoProject.previewStart ?? 0

    const handleLoaded = () => {
      video.currentTime = startTime
      video.play().catch(() => {})
    }

    const handleTimeUpdate = () => {
      if (video.currentTime >= startTime + CLIP_DURATION) {
        video.currentTime = startTime
      }
    }

    video.src = videoProject.videoPreview || videoProject.videoFull
    video.addEventListener('loadedmetadata', handleLoaded)
    video.addEventListener('timeupdate', handleTimeUpdate)

    if (video.readyState >= 1) handleLoaded()

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.pause()
      video.src = ''
    }
  }, [videoProject?.slug])

  const showVideo = !!(videoProject?.videoFull)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {/* Slideshow de imagens */}
      {slots.map((slot, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slot.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: showVideo ? 0 : slot.opacity,
            zIndex: slot.zIndex,
            transition: `opacity ${FADE_DURATION}ms ease`,
          }}
        />
      ))}

      {/* Vídeo de fundo no hover */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: showVideo ? 1 : 0,
          zIndex: 3,
          transition: `opacity ${FADE_DURATION}ms ease`,
        }}
      />
    </div>
  )
}
