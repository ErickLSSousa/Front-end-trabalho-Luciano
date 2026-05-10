import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

/* ─── CSS ────────────────────────────────────────────────── */
const DASH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes blob-move {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-30px) scale(1.08); }
    66%      { transform: translate(-25px,20px) scale(0.94); }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  @keyframes shine {
    0%   { left:-100%; opacity:0; }
    20%  { opacity:.5; }
    100% { left:200%; opacity:0; }
  }
  @keyframes pulse-ring {
    0%   { transform:scale(1); opacity:.6; }
    100% { transform:scale(1.9); opacity:0; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes scan {
    0%   { top: -4px; }
    100% { top: 104%; }
  }

  *, *::before, *::after { box-sizing: border-box; }

  body { font-family: 'DM Sans', sans-serif; }

  *::-webkit-scrollbar { width: 5px; }
  *::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius:999px; }

  .action-btn:hover .btn-shine { animation: shine 1.2s ease; }
`

/* ─── Helpers ────────────────────────────────────────────── */
function getUserFromToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    return JSON.parse(atob(token.split('.')[1]))
  } catch { return null }
}

function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

/* ─── Skeleton ───────────────────────────────────────────── */
function SkeletonCard() {
  const s = {
    background: 'linear-gradient(90deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 100%)',
    backgroundSize: '600px 100%',
    animation: 'shimmer 1.4s ease infinite',
    borderRadius: 10,
  }
  return (
    <div style={{
      background: 'rgba(15,23,42,.6)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,.07)', borderRadius: 24, padding: '28px 32px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ ...s, width: 140, height: 14 }} />
        <div style={{ ...s, width: 80, height: 26, borderRadius: 999 }} />
      </div>
      <div style={{ ...s, width: 180, height: 38, marginBottom: 8 }} />
      <div style={{ ...s, width: 120, height: 12, marginBottom: 28 }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[1, 2, 3].map(i => <div key={i} style={{ ...s, flex: 1, height: 48, borderRadius: 14 }} />)}
      </div>
    </div>
  )
}

/* ─── Empty State ────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      style={{
        textAlign: 'center', padding: '72px 32px',
        background: 'rgba(15,23,42,.5)', backdropFilter: 'blur(20px)',
        border: '1px dashed rgba(255,255,255,.1)', borderRadius: 24,
      }}
    >
      <div style={{
        width: 80, height: 80, borderRadius: 22, margin: '0 auto 24px',
        background: 'rgba(37,99,235,.15)', border: '1px solid rgba(37,99,235,.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'float 3s ease-in-out infinite',
      }}>
        <i className="pi pi-wallet" style={{ fontSize: '2.2rem', color: '#2563eb' }} />
      </div>
      <h3 style={{ margin: '0 0 8px', color: '#e2e8f0', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
        Nenhuma conta encontrada
      </h3>
      <p style={{ margin: 0, color: '#475569', fontSize: '.9rem' }}>
        Nenhuma conta está vinculada ao seu perfil.
      </p>
    </motion.div>
  )
}

/* ─── Action Button ──────────────────────────────────────── */
function ActionBtn({ to, icon, label, variant = 'ghost' }) {
  const map = {
    primary: {
      background: 'linear-gradient(135deg,#2563eb,#38bdf8)',
      color: '#fff', border: 'none',
      boxShadow: '0 4px 20px rgba(37,99,235,.4)',
    },
    success: {
      background: 'linear-gradient(135deg,#16a34a,#22c55e)',
      color: '#fff', border: 'none',
      boxShadow: '0 4px 20px rgba(34,197,94,.35)',
    },
    ghost: {
      background: 'rgba(255,255,255,.05)',
      color: '#94a3b8',
      border: '1px solid rgba(255,255,255,.1)',
    },
  }

  return (
    <Link to={to} style={{ flex: 1, textDecoration: 'none' }}>
      <motion.button
        className="action-btn"
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: .97 }}
        style={{
          width: '100%', padding: '13px 8px', borderRadius: 14,
          fontSize: '.8rem', fontWeight: 700, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          position: 'relative', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
          ...map[variant],
        }}
      >
        <span
          className="btn-shine"
          style={{
            position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
        <i className={`pi ${icon}`} style={{ fontSize: '1.05rem' }} />
        {label}
      </motion.button>
    </Link>
  )
}

/* ─── Account Card ───────────────────────────────────────── */
function AccountCard({ account, index }) {
  const [visible, setVisible] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spot, setSpot] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  function onMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    setTilt({ x: (y - .5) * 7, y: (x - .5) * -7 })
    setSpot({ x: x * 100, y: y * 100 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
      onMouseEnter={() => setHovered(true)}
      style={{
        background: 'rgba(10,18,36,.8)', backdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,.09)', borderRadius: 26,
        padding: '30px 32px', position: 'relative', overflow: 'hidden',
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform .12s ease, box-shadow .2s ease',
        boxShadow: hovered
          ? '0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(56,189,248,.12)'
          : '0 8px 40px rgba(0,0,0,.4)',
      }}
    >
      {/* Spotlight hover */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 26, pointerEvents: 'none',
        background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(37,99,235,.11) 0%, transparent 65%)`,
        transition: 'opacity .2s',
        opacity: hovered ? 1 : 0,
      }} />

      {/* Scan line animada no hover */}
      {hovered && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg,transparent,rgba(56,189,248,.35),transparent)',
          animation: 'scan .9s linear infinite',
          pointerEvents: 'none', zIndex: 2,
        }} />
      )}

      {/* Borda glow topo */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(56,189,248,.5),transparent)',
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity .3s',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <p style={{
            margin: 0, fontSize: '.7rem', fontWeight: 600, color: '#334155',
            textTransform: 'uppercase', letterSpacing: '.1em'
          }}>
            Conta Corrente
          </p>
          <p style={{
            margin: '4px 0 0', fontSize: '.92rem', color: '#475569',
            fontFamily: 'monospace', letterSpacing: '.07em'
          }}>
            #{account.accountNumber}
          </p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.22)',
          borderRadius: 999, padding: '4px 13px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e',
              animation: 'pulse-ring .85s ease-out infinite',
            }} />
          </div>
          <span style={{ fontSize: '.7rem', fontWeight: 700, color: '#22c55e' }}>Ativa</span>
        </div>
      </div>

      {/* Saldo */}
      <div style={{ marginBottom: 20 }}>
        <p style={{
          margin: '0 0 6px', fontSize: '.7rem', color: '#334155',
          textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600
        }}>
          Saldo disponível
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <motion.p
            layout
            style={{
              margin: 0,
              fontSize: '2.3rem',
              fontWeight: 800,
              letterSpacing: '-.04em',
              fontFamily: 'Syne, sans-serif',
              background: 'linear-gradient(135deg,#38bdf8,#22c55e)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: visible ? 'none' : 'blur(10px)',
              transition: 'filter .35s',
              userSelect: visible ? 'text' : 'none',
            }}
          >
            {formatBRL(account.balance)}
          </motion.p>

          <motion.button
            whileTap={{ scale: .9 }}
            onClick={() => setVisible(v => !v)}
            style={{
              background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 9, padding: '7px 11px', cursor: 'pointer',
              color: visible ? '#38bdf8' : '#475569',
              transition: 'all .2s', lineHeight: 1, flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = '#e2e8f0' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = visible ? '#38bdf8' : '#475569' }}
            title={visible ? 'Ocultar saldo' : 'Mostrar saldo'}
          >
            <i className={`pi ${visible ? 'pi-eye-slash' : 'pi-eye'}`} style={{ fontSize: '.85rem' }} />
          </motion.button>
        </div>
      </div>

      {/* Titular */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26,
        paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.06)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,#2563eb,#facc15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.8rem', fontWeight: 800, color: '#020617', flexShrink: 0,
          fontFamily: 'Syne, sans-serif',
        }}>
          {getInitials(account.fullName)}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '.72rem', color: '#334155' }}>Titular</p>
          <p style={{ margin: 0, fontSize: '.88rem', color: '#cbd5e1', fontWeight: 600 }}>
            {account.fullName}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div style={{ display: 'flex', gap: 10 }}>
        <ActionBtn to={`/account/${account.accountNumber}`} icon="pi-chart-line" label="Detalhes" variant="ghost" />
        <ActionBtn to="/transfer" icon="pi-send" label="Transferir" variant="primary" />
        <ActionBtn to="/deposit" icon="pi-plus-circle" label="Depositar" variant="success" />
      </div>
    </motion.div>
  )
}

/* ─── Dashboard ──────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = getUserFromToken()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    api.get('/accounts')
      .then(res => {
        // Suporta { accounts: [] } ou array direto
        const raw = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.accounts)
            ? res.data.accounts
            : []

        // ✅ FIX PRINCIPAL: sem filtro por userId
        // O backend já retorna apenas as contas do usuário autenticado via token.
        // Se por algum motivo a API retornar contas de todos, descomente a linha abaixo:
        // const list = raw.filter(a => String(a.userId) === String(user.id ?? user.sub))
        setAccounts(raw)
      })
      .catch(err => {
        const msg = err?.response?.data?.message || 'Erro ao carregar contas. Tente novamente.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance ?? 0), 0)

  const blobs = [
    { w: 520, h: 520, top: '-18%', left: '-12%', color: 'rgba(37,99,235,.11)', dur: '10s' },
    { w: 420, h: 420, bottom: '4%', right: '-9%', color: 'rgba(250,204,21,.08)', dur: '13s' },
    { w: 320, h: 320, top: '38%', left: '42%', color: 'rgba(56,189,248,.07)', dur: '16s' },
  ]

  const firstName = (user?.name || user?.fullName || 'Usuário').split(' ')[0]

  return (
    <div style={{ minHeight: '100vh', background: '#020a18', position: 'relative', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{DASH_CSS}</style>

      {/* Blobs de fundo */}
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'fixed', width: b.w, height: b.h,
          top: b.top, left: b.left, right: b.right, bottom: b.bottom,
          borderRadius: '50%', background: b.color, filter: 'blur(90px)',
          animation: `blob-move ${b.dur} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Grain overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: .025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 740, margin: '0 auto', padding: '44px 24px 100px' }}>

        {/* Topo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}
        >
          <div>
            <p style={{
              margin: 0, fontSize: '.72rem', color: '#334155',
              textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600
            }}>
              Bem-vindo de volta 👋
            </p>
            <h1 style={{
              margin: '6px 0 0', fontSize: '2rem', fontWeight: 800,
              letterSpacing: '-.04em', fontFamily: 'Syne, sans-serif',
              background: 'linear-gradient(135deg,#e2e8f0 30%,#38bdf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {firstName}
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
            onClick={() => { localStorage.clear(); navigate('/login') }}
            style={{
              background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.22)',
              borderRadius: 13, padding: '10px 18px', cursor: 'pointer',
              color: '#f87171', fontWeight: 600, fontSize: '.8rem',
              display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'DM Sans, sans-serif',
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,.1)'}
          >
            <i className="pi pi-sign-out" />
            Sair
          </motion.button>
        </motion.div>

        {/* Cartão de patrimônio total */}
        <AnimatePresence>
          {!loading && !error && accounts.length > 0 && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: .1 }}
              style={{
                background: 'linear-gradient(135deg,rgba(37,99,235,.18),rgba(56,189,248,.1))',
                border: '1px solid rgba(37,99,235,.28)', borderRadius: 22,
                padding: '24px 30px', marginBottom: 32,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backdropFilter: 'blur(24px)', position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                background: 'linear-gradient(90deg,transparent,rgba(56,189,248,.5),transparent)',
              }} />
              <div>
                <p style={{
                  margin: 0, fontSize: '.7rem', color: '#475569',
                  textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600
                }}>
                  Patrimônio total
                </p>
                <p style={{
                  margin: '6px 0 0', fontSize: '2rem', fontWeight: 800,
                  letterSpacing: '-.04em', fontFamily: 'Syne, sans-serif',
                  background: 'linear-gradient(135deg,#38bdf8,#22c55e)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {formatBRL(totalBalance)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  margin: 0, fontSize: '.7rem', color: '#475569',
                  textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600
                }}>
                  Contas ativas
                </p>
                <p style={{
                  margin: '6px 0 0', fontSize: '2.2rem', fontWeight: 800,
                  color: '#38bdf8', fontFamily: 'Syne, sans-serif'
                }}>
                  {accounts.length}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Label seção */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15 }}
          style={{
            margin: '0 0 18px', fontSize: '.7rem', color: '#334155',
            textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 700
          }}
        >
          Suas contas
        </motion.p>

        {/* Conteúdo principal */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <SkeletonCard />
              <SkeletonCard />
            </motion.div>

          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(239,68,68,.09)', border: '1px solid rgba(239,68,68,.22)',
                borderRadius: 18, padding: '20px 24px', color: '#f87171',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(239,68,68,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="pi pi-exclamation-triangle" style={{ fontSize: '1.3rem' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '.95rem', fontFamily: 'Syne, sans-serif' }}>
                  Algo deu errado
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '.83rem', opacity: .75 }}>{error}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
                onClick={() => { setError(''); setLoading(true); window.location.reload() }}
                style={{
                  marginLeft: 'auto', background: 'rgba(239,68,68,.15)',
                  border: '1px solid rgba(239,68,68,.3)', borderRadius: 10,
                  padding: '8px 14px', color: '#f87171', cursor: 'pointer',
                  fontSize: '.78rem', fontWeight: 600, flexShrink: 0,
                }}
              >
                Tentar novamente
              </motion.button>
            </motion.div>

          ) : accounts.length === 0 ? (
            <EmptyState key="empty" />

          ) : (
            <motion.div key="accounts" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {accounts.map((account, i) => (
                <AccountCard key={account.accountNumber ?? i} account={account} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}