import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

/* ─── CSS ────────────────────────────────────────────────── */
const CSS = `
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
  @keyframes pulse-ring {
    0%   { transform:scale(1); opacity:.6; }
    100% { transform:scale(1.9); opacity:0; }
  }
  @keyframes shine {
    0%   { left:-100%; opacity:0; }
    20%  { opacity:.4; }
    100% { left:200%; opacity:0; }
  }
  @keyframes scan {
    0%   { top:-4px; }
    100% { top:104%; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans', sans-serif; }
  *::-webkit-scrollbar { width:5px; }
  *::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:999px; }

  .act-btn:hover { transform: translateY(-3px) scale(1.03); }
  .act-btn:hover .shine { animation: shine 1s ease; }
  .act-btn { transition: transform .18s ease, box-shadow .18s ease; }

  .tx-row:hover { background: rgba(255,255,255,.05) !important; }
  .tx-row { transition: background .15s ease; }
`

/* ─── Helpers ────────────────────────────────────────────── */
function formatBRL(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(d) {
  return new Date(d).toLocaleString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const TYPE_META = {
  DEPOSIT: { label: 'Depósito', icon: 'pi-arrow-down-left', color: '#22c55e', bg: 'rgba(34,197,94,.1)', sign: '+' },
  WITHDRAW: { label: 'Saque', icon: 'pi-arrow-up-right', color: '#ef4444', bg: 'rgba(239,68,68,.1)', sign: '-' },
  TRANSFER_OUT: { label: 'Transferência', icon: 'pi-send', color: '#f59e0b', bg: 'rgba(245,158,11,.1)', sign: '-' },
  TRANSFER_IN: { label: 'Recebido', icon: 'pi-arrow-down', color: '#38bdf8', bg: 'rgba(56,189,248,.1)', sign: '+' },
}

/* ─── Skeleton ───────────────────────────────────────────── */
function Skeleton({ w = '100%', h = 16, r = 10 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 100%)',
      backgroundSize: '600px 100%',
      animation: 'shimmer 1.4s ease infinite',
    }} />
  )
}

/* ─── Action Button ──────────────────────────────────────── */
function ActBtn({ onClick, icon, label, variant = 'ghost', href }) {
  const map = {
    primary: { background: 'linear-gradient(135deg,#2563eb,#38bdf8)', color: '#fff', border: 'none', boxShadow: '0 4px 20px rgba(37,99,235,.35)' },
    success: { background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff', border: 'none', boxShadow: '0 4px 20px rgba(34,197,94,.3)' },
    danger: { background: 'rgba(239,68,68,.12)', color: '#f87171', border: '1px solid rgba(239,68,68,.25)' },
    ghost: { background: 'rgba(255,255,255,.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,.1)' },
  }

  const btn = (
    <button
      className="act-btn"
      onClick={onClick}
      style={{
        padding: '12px 20px', borderRadius: 14,
        fontSize: '.82rem', fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        position: 'relative', overflow: 'hidden',
        fontFamily: 'DM Sans, sans-serif',
        ...map[variant],
      }}
    >
      <span className="shine" style={{
        position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)',
        transform: 'skewX(-20deg)',
      }} />
      <i className={`pi ${icon}`} style={{ fontSize: '.95rem' }} />
      {label}
    </button>
  )

  if (href) return <a href={href} style={{ textDecoration: 'none' }}>{btn}</a>
  return btn
}

/* ─── Transaction Row ────────────────────────────────────── */
function TxRow({ tx, index }) {
  const meta = TYPE_META[tx.type] || TYPE_META.DEPOSIT
  const isOut = tx.type === 'WITHDRAW' || tx.type === 'TRANSFER_OUT'

  return (
    <motion.div
      className="tx-row"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 18px', borderRadius: 16,
        background: 'rgba(255,255,255,.02)',
        border: '1px solid rgba(255,255,255,.05)',
      }}
    >
      {/* Ícone */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <i className={`pi ${meta.icon}`} style={{ color: meta.color, fontSize: '1rem' }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '.88rem', fontWeight: 600, color: '#cbd5e1' }}>
          {meta.label}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '.75rem', color: '#475569' }}>
          {tx.description || meta.label} · {formatDate(tx.createdAt || tx.date)}
        </p>
      </div>

      {/* Valor */}
      <p style={{
        margin: 0, fontWeight: 700, fontSize: '1rem', flexShrink: 0,
        color: isOut ? '#ef4444' : '#22c55e',
        fontFamily: 'Syne, sans-serif',
      }}>
        {isOut ? '-' : '+'}{formatBRL(tx.amount)}
      </p>
    </motion.div>
  )
}

/* ─── Main ───────────────────────────────────────────────── */
export default function AccountDetails() {
  const { accountNumber } = useParams()
  const navigate = useNavigate()

  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [txLoading, setTxLoading] = useState(true)
  const [error, setError] = useState('')
  const [balVisible, setBalVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [spot, setSpot] = useState({ x: 50, y: 50 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function onMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    setTilt({ x: (y - .5) * 6, y: (x - .5) * -6 })
    setSpot({ x: x * 100, y: y * 100 })
  }

  async function loadData() {
    setError('')
    setLoading(true)
    setTxLoading(true)

    try {
      const accRes = await api.get(`/accounts/${accountNumber}`)
      setAccount(accRes.data)
    } catch {
      setError('Erro ao carregar dados da conta')
    } finally {
      setLoading(false)
    }

    try {
      const txRes = await api.get(`/transactions/${accountNumber}`)
      setTransactions(txRes.data.transactions || [])
    } catch {
      setTransactions([])
    } finally {
      setTxLoading(false)
    }
  }

  useEffect(() => { loadData() }, [accountNumber])

  const blobs = [
    { w: 480, h: 480, top: '-15%', left: '-10%', color: 'rgba(37,99,235,.1)', dur: '11s' },
    { w: 380, h: 380, bottom: '5%', right: '-8%', color: 'rgba(56,189,248,.08)', dur: '14s' },
    { w: 300, h: 300, top: '40%', left: '45%', color: 'rgba(250,204,21,.07)', dur: '17s' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#020a18', position: 'relative', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{CSS}</style>

      {/* Blobs */}
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'fixed', width: b.w, height: b.h,
          top: b.top, left: b.left, right: b.right, bottom: b.bottom,
          borderRadius: '50%', background: b.color, filter: 'blur(90px)',
          animation: `blob-move ${b.dur} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Grain */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: .025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 740, margin: '0 auto', padding: '44px 24px 100px' }}>

        {/* Header nav */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
              borderRadius: 12, padding: '10px 14px', cursor: 'pointer',
              color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '.82rem', fontWeight: 600, transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = '#e2e8f0' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = '#94a3b8' }}
          >
            <i className="pi pi-arrow-left" style={{ fontSize: '.85rem' }} />
            Voltar
          </button>

          <div>
            <p style={{ margin: 0, fontSize: '.7rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
              Detalhes da conta
            </p>
            <h1 style={{
              margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne, sans-serif',
              letterSpacing: '-.03em',
              background: 'linear-gradient(135deg,#e2e8f0 30%,#38bdf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              #{accountNumber}
            </h1>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={loadData}
              style={{
                background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
                borderRadius: 12, padding: '10px 14px', cursor: 'pointer',
                color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6,
                fontSize: '.82rem', fontWeight: 600, transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8' }}
            >
              <i className="pi pi-refresh" style={{ fontSize: '.85rem' }} />
              Atualizar
            </button>
          </div>
        </motion.div>

        {/* Cartão de saldo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={onMouseMove}
          onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
          onMouseEnter={() => setHovered(true)}
          style={{
            background: 'rgba(10,18,36,.8)', backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,.09)', borderRadius: 26,
            padding: '32px 36px', marginBottom: 20,
            position: 'relative', overflow: 'hidden',
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform .12s ease, box-shadow .2s ease',
            boxShadow: hovered
              ? '0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(56,189,248,.12)'
              : '0 8px 40px rgba(0,0,0,.4)',
          }}
        >
          {/* Spotlight */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 26, pointerEvents: 'none',
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(37,99,235,.11) 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0, transition: 'opacity .2s',
          }} />

          {/* Scan line */}
          {hovered && (
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg,transparent,rgba(56,189,248,.3),transparent)',
              animation: 'scan .9s linear infinite', pointerEvents: 'none', zIndex: 2,
            }} />
          )}

          {/* Glow top */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(56,189,248,.5),transparent)',
            opacity: hovered ? 1 : 0.4, transition: 'opacity .3s',
          }} />

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Skeleton w={160} h={13} />
              <Skeleton w={240} h={44} />
              <Skeleton w={120} h={12} />
            </div>
          ) : error ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#f87171' }}>
              <i className="pi pi-exclamation-triangle" style={{ fontSize: '1.2rem' }} />
              <p style={{ margin: 0 }}>{error}</p>
            </div>
          ) : (
            <>
              {/* Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <p style={{ margin: 0, fontSize: '.7rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
                    Conta Corrente
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '.9rem', color: '#475569', fontFamily: 'monospace', letterSpacing: '.07em' }}>
                    #{accountNumber}
                  </p>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.22)',
                  borderRadius: 999, padding: '4px 13px',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e', animation: 'pulse-ring .85s ease-out infinite' }} />
                  </div>
                  <span style={{ fontSize: '.7rem', fontWeight: 700, color: '#22c55e' }}>Ativa</span>
                </div>
              </div>

              {/* Saldo */}
              <p style={{ margin: '0 0 6px', fontSize: '.7rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
                Saldo disponível
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <p style={{
                  margin: 0, fontSize: '2.6rem', fontWeight: 800, letterSpacing: '-.04em',
                  fontFamily: 'Syne, sans-serif',
                  background: 'linear-gradient(135deg,#38bdf8,#22c55e)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  filter: balVisible ? 'none' : 'blur(10px)',
                  transition: 'filter .35s',
                  userSelect: balVisible ? 'text' : 'none',
                }}>
                  {formatBRL(account?.balance ?? 0)}
                </p>
                <button
                  onClick={() => setBalVisible(v => !v)}
                  style={{
                    background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 9, padding: '7px 11px', cursor: 'pointer',
                    color: balVisible ? '#38bdf8' : '#475569', transition: 'all .2s', lineHeight: 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)' }}
                >
                  <i className={`pi ${balVisible ? 'pi-eye-slash' : 'pi-eye'}`} style={{ fontSize: '.85rem' }} />
                </button>
              </div>

              {/* Titular */}
              {account?.fullName && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.06)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#2563eb,#facc15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '.8rem', fontWeight: 800, color: '#020617',
                    fontFamily: 'Syne, sans-serif',
                  }}>
                    {account.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '.72rem', color: '#334155' }}>Titular</p>
                    <p style={{ margin: 0, fontSize: '.88rem', color: '#cbd5e1', fontWeight: 600 }}>{account.fullName}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }}
          style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}
        >
          <ActBtn href="/transfer" icon="pi-send" label="Transferir" variant="primary" />
          <ActBtn href="/deposit" icon="pi-plus-circle" label="Depositar" variant="success" />
        </motion.div>

        {/* Extrato */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: '.7rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 700 }}>
              Extrato
            </p>
            {transactions.length > 0 && (
              <span style={{ fontSize: '.75rem', color: '#475569' }}>
                {transactions.length} movimentaç{transactions.length === 1 ? 'ão' : 'ões'}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {txLoading ? (
              <motion.div key="txload" exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '14px 18px', borderRadius: 16,
                    background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)',
                  }}>
                    <Skeleton w={42} h={42} r={12} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Skeleton w={120} h={12} />
                      <Skeleton w={180} h={10} />
                    </div>
                    <Skeleton w={80} h={16} />
                  </div>
                ))}
              </motion.div>

            ) : transactions.length === 0 ? (
              <motion.div
                key="txempty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center', padding: '56px 32px',
                  background: 'rgba(15,23,42,.4)', backdropFilter: 'blur(20px)',
                  border: '1px dashed rgba(255,255,255,.08)', borderRadius: 20,
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 18, margin: '0 auto 18px',
                  background: 'rgba(37,99,235,.12)', border: '1px solid rgba(37,99,235,.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className="pi pi-list" style={{ fontSize: '1.6rem', color: '#2563eb' }} />
                </div>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontFamily: 'Syne, sans-serif', fontSize: '1rem' }}>
                  Nenhuma movimentação
                </p>
                <p style={{ margin: '6px 0 0', color: '#475569', fontSize: '.85rem' }}>
                  Suas transações aparecerão aqui.
                </p>
              </motion.div>

            ) : (
              <motion.div key="txlist" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {transactions.map((tx, i) => (
                  <TxRow key={tx.id ?? i} tx={tx} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}