import { useEffect, useRef } from 'react'

const WAVE_DEFS = [
  { yPos: 0.28, amp: 0.022, freq: 0.50, speed: 0.00010, color: [148, 0,   255] as [number,number,number] },
  { yPos: 0.54, amp: 0.018, freq: 0.65, speed: 0.00008, color: [120, 40,  255] as [number,number,number] },
  { yPos: 0.78, amp: 0.020, freq: 0.42, speed: 0.00009, color: [174, 100, 255] as [number,number,number] },
]

const COLS = 120

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x: -1, y: 0.5, px: -1, py: 0.5, active: false })

  // Y offset field — cursor Y drags wave up/down
  const yOffset = useRef<Float32Array>(new Float32Array(COLS))
  // Amplitude field — horizontal movement swells/shrinks the wave
  const ampBoost = useRef<Float32Array>(new Float32Array(COLS))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let W = 0, H = 0
    let t = 0

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouse.current.px     = mouse.current.x
      mouse.current.py     = mouse.current.y
      mouse.current.x      = e.clientX / window.innerWidth
      mouse.current.y      = e.clientY / window.innerHeight
      mouse.current.active = true
    }
    const onLeave = () => { mouse.current.active = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    const draw = () => {
      t++
      ctx.clearRect(0, 0, W, H)

      const mx     = mouse.current.x
      const my     = mouse.current.y
      const vx     = mx - mouse.current.px   // horizontal velocity
      const active = mouse.current.active

      for (let c = 0; c < COLS; c++) {
        const cx = c / (COLS - 1)

        if (active && mx >= 0) {
          const dist      = Math.abs(cx - mx)
          const influence = Math.exp(-(dist * dist) / (2 * 0.20 * 0.20))

          // Y drag — cursor vertical position pulls wave up/down
          const yPull  = (my - 0.5) * 0.18 * influence
          yOffset.current[c] += (yPull - yOffset.current[c]) * 0.012

          // Amplitude swell — horizontal movement grows the wave at cursor X
          // Moving right (+vx) swells, moving left (-vx) shrinks
          const ampTarget = Math.abs(vx) * 18 * influence
          ampBoost.current[c] += (ampTarget - ampBoost.current[c]) * 0.018
        } else {
          yOffset.current[c]  *= 0.992
          ampBoost.current[c] *= 0.988
        }
      }

      // Lateral diffusion for both fields
      const yo  = yOffset.current
      const ab  = ampBoost.current
      const yTmp = new Float32Array(yo)
      const aTmp = new Float32Array(ab)
      for (let c = 1; c < COLS - 1; c++) {
        yo[c] += (yTmp[c - 1] + yTmp[c + 1] - 2 * yTmp[c]) * 0.015
        ab[c] += (aTmp[c - 1] + aTmp[c + 1] - 2 * aTmp[c]) * 0.010
      }

      // ── Draw waves ────────────────────────────────────────────────
      for (const wave of WAVE_DEFS) {
        const baseY   = H * wave.yPos
        const baseAmp = H * wave.amp

        const pts: { x: number; y: number }[] = []

        for (let i = 0; i <= COLS; i++) {
          const nx    = i / COLS
          const x     = nx * W
          const phase = x * wave.freq * 0.005 + t * wave.speed * 60
          const ci    = Math.min(Math.floor(nx * COLS), COLS - 1)

          const yOff = yo[ci] * H
          // Amplitude: base + Y-drag swell + horizontal swell
          const swell = 1
            + Math.abs(yo[ci]) * 5      // dragging up/down grows the wave
            + ab[ci] * 4                // horizontal movement grows it too
          const amp = baseAmp * swell

          const y = baseY + yOff
            + Math.sin(phase) * amp
            + Math.sin(phase * 0.53 + 1.2) * amp * 0.35

          pts.push({ x, y })
        }

        const [r, g, b] = wave.color

        ctx.beginPath()
        ctx.moveTo(0, H)
        ctx.lineTo(pts[0].x, pts[0].y)
        for (let i = 0; i < pts.length - 1; i++) {
          const cpx = (pts[i].x + pts[i + 1].x) / 2
          const cpy = (pts[i].y + pts[i + 1].y) / 2
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, cpx, cpy)
        }
        ctx.lineTo(W, pts[pts.length - 1].y)
        ctx.lineTo(W, H)
        ctx.closePath()

        const grad = ctx.createLinearGradient(0, baseY - baseAmp * 3, 0, baseY + baseAmp * 6)
        grad.addColorStop(0,   `rgba(${r},${g},${b},0.00)`)
        grad.addColorStop(0.4, `rgba(${r},${g},${b},0.14)`)
        grad.addColorStop(1,   `rgba(${r},${g},${b},0.00)`)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 0; i < pts.length - 1; i++) {
          const cpx = (pts[i].x + pts[i + 1].x) / 2
          const cpy = (pts[i].y + pts[i + 1].y) / 2
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, cpx, cpy)
        }
        ctx.lineTo(W, pts[pts.length - 1].y)
        ctx.strokeStyle = `rgba(${r},${g},${b},0.28)`
        ctx.lineWidth   = 1.5
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} id="wave-canvas" />
}
