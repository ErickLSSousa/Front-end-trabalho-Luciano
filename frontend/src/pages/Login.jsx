import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import authService from '../services/authService'

/* ─── Instale se ainda não tiver: npm i react-hot-toast ─── */

/* ─── Keyframes & estilos globais do arquivo ─────────────── */
const GLOBAL_CSS = `
  @keyframes blob-move {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-30px) scale(1.08); }
    66%      { transform: translate(-25px,20px) scale(0.94); }
  }
  @keyframes float-logo {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-7px); }
  }
  @keyframes shine-sweep {
    0%   { left:-100%; opacity:0; }
    20%  { opacity:.5; }
    100% { left:200%; opacity:0; }
  }
  @keyframes ripple-out {
    to { transform:scale(4); opacity:0; }
  }
  @keyframes cursor-pulse {
    0%,100% { transform:translate(-50%,-50%) scale(1); opacity:.7; }
    50%      { transform:translate(-50%,-50%) scale(1.4); opacity:.3; }
  }
  * { cursor: none !important; }
  #custom-cursor {
    width:10px; height:10px;
    background:#facc15; border-radius:50%;
    position:fixed; pointer-events:none; z-index:99999;
    transform:translate(-50%,-50%);
    transition:transform .08s, width .2s, height .2s, background .2s;
    mix-blend-mode:difference;
    animation: cursor-pulse 2s ease-in-out infinite;
  }
  #custom-cursor.hovering {
    width:24px; height:24px; background:#38bdf8;
  }
  @media (max-width:480px) { * { cursor:auto !important; } #custom-cursor { display:none; } }
`

/* ─── Utils ──────────────────────────────────────────────── */
const toastStyle = ok => ({
  style: {
    background: 'rgba(15,23,42,0.95)',
    backdropFilter: 'blur(20px)',
    color: '#e2e8f0',
    border: `1px solid ${ok ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
    borderRadius: '12px',
    fontSize: '0.875rem',
    boxShadow: `0 8px 32px ${ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
  }
})

/* ─── FloatInput ─────────────────────────────────────────── */
function FloatInput({ label, value, onChange, type = 'text', name, icon, autoComplete }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <i className={`pi ${icon}`} style={{
          position: 'absolute', left: 14, top: '50%',
          transform: 'translateY(-50%)',
          color: focused ? '#38bdf8' : '#475569',
          fontSize: '0.9rem', transition: 'color .2s',
          zIndex: 2, pointerEvents: 'none',
        }} />
      )}
      <input
        name={name} type={type} value={value}
        onChange={onChange} autoComplete={autoComplete} required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: focused ? 'rgba(37,99,235,0.07)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? '#2563eb' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12, color: '#e2e8f0', fontSize: '0.9rem',
          paddingTop: active ? 20 : 14, paddingBottom: active ? 8 : 14,
          paddingLeft: icon ? 42 : 14, paddingRight: 14,
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.18), 0 0 24px rgba(37,99,235,0.1)' : 'none',
          transition: 'all .2s',
        }}
      />
      <label style={{
        position: 'absolute', pointerEvents: 'none', zIndex: 1,
        left: icon ? 42 : 14,
        top: active ? 8 : '50%',
        transform: active ? 'none' : 'translateY(-50%)',
        fontSize: active ? '0.66rem' : '0.88rem',
        fontWeight: active ? 600 : 400,
        color: focused ? '#38bdf8' : '#475569',
        letterSpacing: active ? '0.06em' : 0,
        textTransform: active ? 'uppercase' : 'none',
        transition: 'all .2s',
      }}>
        {label}
      </label>
    </div>
  )
}

/* ─── FloatPassword (custom, sem PrimeReact) ─────────────── */
function FloatPassword({ label, value, onChange }) {
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)
  const active = focused || value.length > 0

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value} onChange={onChange} required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: focused ? 'rgba(37,99,235,0.07)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? '#2563eb' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12, color: '#e2e8f0', fontSize: '0.9rem',
          paddingTop: active ? 20 : 14, paddingBottom: active ? 8 : 14,
          paddingLeft: 14, paddingRight: 46,
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.18), 0 0 24px rgba(37,99,235,0.1)' : 'none',
          transition: 'all .2s',
        }}
      />
      <label style={{
        position: 'absolute', pointerEvents: 'none', zIndex: 1, left: 14,
        top: active ? 8 : '50%',
        transform: active ? 'none' : 'translateY(-50%)',
        fontSize: active ? '0.66rem' : '0.88rem',
        fontWeight: active ? 600 : 400,
        color: focused ? '#38bdf8' : '#475569',
        letterSpacing: active ? '0.06em' : 0,
        textTransform: active ? 'uppercase' : 'none',
        transition: 'all .2s',
      }}>
        {label}
      </label>
      <button
        type="button" onClick={() => setShow(v => !v)}
        style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: '#475569',
          cursor: 'pointer', padding: 0, lineHeight: 1, transition: 'color .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
        onMouseLeave={e => e.currentTarget.style.color = '#475569'}
      >
        <i className={`pi ${show ? 'pi-eye-slash' : 'pi-eye'}`} style={{ fontSize: '0.95rem' }} />
      </button>
    </div>
  )
}

/* ─── RippleButton ───────────────────────────────────────── */
function RippleButton({ children, loading, disabled }) {
  const ref = useRef(null)

  function handleClick(e) {
    const btn = ref.current
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const span = document.createElement('span')
    span.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,0.22);border-radius:50%;
      transform:scale(0);animation:ripple-out .6s ease-out forwards;
      pointer-events:none;
    `
    btn.appendChild(span)
    setTimeout(() => span.remove(), 600)
  }

  const off = loading || disabled
  return (
    <button
      ref={ref} type="submit" onClick={off ? undefined : handleClick} disabled={off}
      style={{
        position: 'relative', overflow: 'hidden', width: '100%',
        padding: '14px 20px', border: 'none', borderRadius: 12,
        background: off
          ? 'rgba(37,99,235,0.35)'
          : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #eab308 100%)',
        color: off ? 'rgba(255,255,255,0.45)' : '#020617',
        fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.03em',
        cursor: off ? 'not-allowed' : 'pointer',
        boxShadow: off ? 'none' : '0 4px 24px rgba(37,99,235,0.35)',
        transition: 'transform .2s, box-shadow .2s',
      }}
      onMouseEnter={e => {
        if (off) return
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 10px 36px rgba(37,99,235,0.55)'
        const s = e.currentTarget.querySelector('.shine')
        if (s) { s.style.animation = 'none'; void s.offsetWidth; s.style.animation = 'shine-sweep .7s ease forwards' }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,99,235,0.35)'
      }}
    >
      <span className="shine" style={{
        position: 'absolute', top: 0, left: '-100%', width: '55%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
        transform: 'skewX(-20deg)', pointerEvents: 'none',
      }} />
      {children}
    </button>
  )
}

/* ─── Custom Cursor ──────────────────────────────────────── */
function CustomCursor() {
  const el = useRef(null)
  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.id = 'custom-cursor'
    document.body.appendChild(cursor)
    const move = e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px' }
    const over = e => { if (e.target.closest('a,button,input,label')) cursor.classList.add('hovering'); else cursor.classList.remove('hovering') }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      cursor.remove()
    }
  }, [])
  return null
}

/* ─── Login ──────────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spot, setSpot] = useState({ x: 50, y: 50 })

  function onMouseMove(e) {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    setTilt({ x: (y - 0.5) * 9, y: (x - 0.5) * -9 })
    setSpot({ x: x * 100, y: y * 100 })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.login({ email, password })
      if (remember) localStorage.setItem('rememberEmail', email)
      toast.success('Bem-vindo de volta! 👋', toastStyle(true))
      setTimeout(() => navigate('/'), 900)
    } catch (err) {
      toast.error(err?.response?.data?.error || 'E-mail ou senha inválidos', toastStyle(false))
    } finally {
      setLoading(false)
    }
  }

  /* Blobs */
  const blobs = [
    { w: 420, h: 420, top: '-12%', left: '-8%', color: 'rgba(37,99,235,0.18)', dur: '9s', del: '0s' },
    { w: 360, h: 360, top: '55%', right: '-6%', color: 'rgba(250,204,21,0.12)', dur: '11s', del: '-4s' },
    { w: 280, h: 280, bottom: '8%', left: '35%', color: 'rgba(56,189,248,0.1)', dur: '13s', del: '-7s' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <style>{GLOBAL_CSS}</style>
      <Toaster position="top-center" />
      <CustomCursor />

      {/* Blobs */}
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'fixed', width: b.w, height: b.h,
          top: b.top, left: b.left, right: b.right, bottom: b.bottom,
          background: b.color, borderRadius: '50%', filter: 'blur(72px)',
          animation: `blob-move ${b.dur} ${b.del} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
          background: 'linear-gradient(160deg, rgba(15,23,42,0.88), rgba(2,6,23,0.94))',
          backdropFilter: 'blur(28px)',
          border: '1px solid rgba(250,204,21,0.15)',
          borderRadius: 24, padding: '44px 40px',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.55), 0 0 100px rgba(250,204,21,0.06)',
          transformStyle: 'preserve-3d',
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform .12s ease',
        }}
        initial={{ opacity: 0, y: 48, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Spotlight radial */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none',
          background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(250,204,21,0.07) 0%, transparent 65%)`,
          transition: 'background .04s',
        }} />

        {/* Header */}
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 32 }}
          initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          <div style={{
            width: 62, height: 62, borderRadius: 18,
            background: 'linear-gradient(135deg, #1d4ed8, #facc15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(37,99,235,0.55)',
            animation: 'float-logo 3.2s ease-in-out infinite',
          }}>
            <i className="pi pi-credit-card" style={{ fontSize: '1.7rem', color: '#020617' }} />
          </div>
          <h1 style={{
            fontSize: '2.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #e2e8f0, #38bdf8 45%, #facc15)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>SenaiBank</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Bem-vindo de volta 👋</p>
        </motion.div>

        {/* Divisor */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 28 }} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
            <FloatInput label="E-mail" value={email} onChange={e => setEmail(e.target.value)}
              type="email" name="email" icon="pi-envelope" autoComplete="email" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
            <FloatPassword label="Senha" value={password} onChange={e => setPassword(e.target.value)} />
          </motion.div>

          {/* Remember + Esqueci */}
          <motion.div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.33 }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#64748b', cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ accentColor: '#2563eb', width: 15, height: 15, cursor: 'pointer' }} />
              Lembrar de mim
            </label>
            <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#38bdf8', textDecoration: 'none', fontWeight: 500, transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#7dd3fc'}
              onMouseLeave={e => e.currentTarget.style.color = '#38bdf8'}
            >
              Esqueci a senha
            </Link>
          </motion.div>

          {/* Botão */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} style={{ marginTop: 4 }}>
            <RippleButton loading={loading}>
              {loading
                ? <><i className="pi pi-spin pi-spinner" style={{ marginRight: 8 }} />Entrando...</>
                : <><i className="pi pi-sign-in" style={{ marginRight: 8 }} />Entrar</>}
            </RippleButton>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p
          style={{ marginTop: 22, textAlign: 'center', fontSize: '0.85rem', color: '#475569' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }}
        >
          Não tem conta?{' '}
          <Link to="/register" style={{ color: '#facc15', fontWeight: 700, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fde68a'}
            onMouseLeave={e => e.currentTarget.style.color = '#facc15'}
          >
            Criar agora →
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}