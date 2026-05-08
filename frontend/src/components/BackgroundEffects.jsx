import { useEffect, useRef } from 'react'

export default function BackgroundEffects() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let w, h
    let stars = []
    let mouse = { x: 0, y: 0 }

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    function createStars(count) {
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.5,
          s: Math.random() * 0.5 + 0.2,
          a: Math.random()
        })
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, w, h)

      stars.forEach(star => {
        star.y -= star.s
        if (star.y < 0) star.y = h

        const glow = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.r * 8
        )

        glow.addColorStop(0, `rgba(250,204,21,${star.a})`)
        glow.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.fillStyle = glow
        ctx.arc(star.x, star.y, star.r * 8, 0, Math.PI * 2)
        ctx.fill()
      })

      const light = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        180
      )

      light.addColorStop(0, 'rgba(250,204,21,0.12)')
      light.addColorStop(1, 'transparent')

      ctx.fillStyle = light
      ctx.fillRect(0, 0, w, h)

      requestAnimationFrame(draw)
    }

    function explode(x, y) {
      for (let i = 0; i < 30; i++) {
        stars.push({
          x,
          y,
          r: Math.random() * 2 + 1,
          s: -Math.random() * 2,
          a: Math.random()
        })
      }
    }

    resize()
    createStars(120)
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })
    window.addEventListener('click', e => explode(e.clientX, e.clientY))

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0
      }}
    />
  )
}
