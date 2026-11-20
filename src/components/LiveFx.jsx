import { useEffect } from 'react'

// Üleleheline "elav kiht": hiire valgus ja kursorile reageeriv helk.
// Ainult osutisega seadmetes ja ilma reduced-motion eelistuseta.
// Element luuakse keha alla, et see ei mõjutaks Reacti renderdust.

function LiveFx() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (reduce || !finePointer) return

    const glow = document.createElement('div')
    glow.className = 'nf-spotlight'
    glow.setAttribute('aria-hidden', 'true')
    document.body.appendChild(glow)

    let frame = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 3

    const paint = () => {
      frame = 0
      glow.style.setProperty('--nf-x', `${x}px`)
      glow.style.setProperty('--nf-y', `${y}px`)
    }

    const onMove = (event) => {
      x = event.clientX
      y = event.clientY
      if (!frame) frame = requestAnimationFrame(paint)
    }

    const onLeave = () => {
      glow.style.opacity = '0'
    }

    const onEnter = () => {
      glow.style.opacity = '1'
    }

    paint()
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      if (frame) cancelAnimationFrame(frame)
      glow.remove()
    }
  }, [])

  return null
}

export default LiveFx
