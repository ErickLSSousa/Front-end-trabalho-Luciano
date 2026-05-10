import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import api from '../services/api'

/* ─── CSS injetado ───────────────────────────────────────── */
const DEPOSIT_CSS = `
  @keyframes blob-move {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-30px) scale(1.08); }
    66%      { transform: translate(-25px,20px) scale(0.94); }
  }
  @keyframes float-logo {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes shine {
    0%   { left: -100%; opacity: 0; }
    20%  { opacity: .5; }
    100% { left: 200%; opacity: 0; }
  }
  @keyframes success-pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes confetti-fall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
  }
  *::-webkit-scrollbar { width: 6px; }
  *::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 999px; }
`

/* ─── Utils ──────────────────────────────────────────────── */
function getUserFromToken() {
    try {
        const token = localStorage.getItem('token')
        if (!token) return null
        return JSON.parse(atob(token.split('.')[1]))
    } catch { return null }
}

function toastStyle(ok) {
    return {
        style: {
            background: 'rgba(15,23,42,.95)', backdropFilter: 'blur(18px)',
            color: '#e2e8f0',
            border: `1px solid ${ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`,
            borderRadius: '14px', fontSize: '.85rem',
            boxShadow: `0 8px 32px ${ok ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}`,
        }
    }
}

function formatBRL(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/* ─── Atalhos de valor ───────────────────────────────────── */
const QUICK_VALUES = [50, 100, 200, 500, 1000]

/* ─── FloatInput genérico ────────────────────────────────── */
function FloatInput({ label, icon, value, onChange, type = 'text', readOnly = false }) {
    const [focused, setFocused] = useState(false)
    const active = focused || String(value).length > 0

    return (
        <div style={{ position: 'relative' }}>
            {icon && (
                <i className={`pi ${icon}`} style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    color: focused ? '#38bdf8' : '#475569', zIndex: 2,
                    transition: '.2s', fontSize: '.9rem', pointerEvents: 'none',
                }} />
            )}
            <input
                type={type} value={value} onChange={onChange} readOnly={readOnly}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{
                    width: '100%', boxSizing: 'border-box',
                    background: readOnly
                        ? 'rgba(255,255,255,.02)'
                        : focused ? 'rgba(37,99,235,.08)' : 'rgba(255,255,255,.04)',
                    border: `1px solid ${focused ? '#2563eb' : 'rgba(255,255,255,.08)'}`,
                    borderRadius: 14, color: readOnly ? '#64748b' : '#e2e8f0',
                    fontSize: '.92rem',
                    paddingTop: active ? 22 : 15, paddingBottom: active ? 8 : 15,
                    paddingLeft: icon ? 42 : 14, paddingRight: 14,
                    outline: 'none', transition: '.2s',
                    boxShadow: focused
                        ? '0 0 0 4px rgba(37,99,235,.12), 0 0 24px rgba(37,99,235,.1)'
                        : 'inset 0 1px 0 rgba(255,255,255,.02)',
                    cursor: readOnly ? 'default' : 'text',
                }}
            />
            <label style={{
                position: 'absolute', left: icon ? 42 : 14,
                top: active ? 8 : '50%',
                transform: active ? 'none' : 'translateY(-50%)',
                fontSize: active ? '.64rem' : '.88rem',
                color: focused ? '#38bdf8' : '#64748b',
                textTransform: active ? 'uppercase' : 'none',
                letterSpacing: active ? '.08em' : '0',
                fontWeight: active ? 700 : 400,
                transition: '.2s', pointerEvents: 'none',
            }}>
                {label}
            </label>
        </div>
    )
}

/* ─── Input de valor com R$ ──────────────────────────────── */
function AmountInput({ value, onChange }) {
    const [focused, setFocused] = useState(false)
    const active = focused || value.length > 0

    return (
        <div style={{ position: 'relative' }}>
            {active && (
                <span style={{
                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                    color: '#22c55e', fontSize: '1.2rem', fontWeight: 700,
                    pointerEvents: 'none', zIndex: 2, lineHeight: 1,
                }}>
                    R$
                </span>
            )}
            <input
                type="text" inputMode="decimal" value={value}
                placeholder={focused ? '' : 'Digite o valor'}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: '100%', boxSizing: 'border-box',
                    background: focused ? 'rgba(34,197,94,.08)' : 'rgba(255,255,255,.04)',
                    border: `1px solid ${focused ? '#22c55e' : 'rgba(255,255,255,.08)'}`,
                    borderRadius: 14, color: '#e2e8f0',
                    fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-.02em',
                    paddingTop: 18, paddingBottom: 18,
                    paddingLeft: active ? 52 : 18, paddingRight: 18,
                    outline: 'none', transition: '.2s', textAlign: active ? 'left' : 'center',
                    boxShadow: focused
                        ? '0 0 0 4px rgba(34,197,94,.12), 0 0 32px rgba(34,197,94,.1)'
                        : 'inset 0 1px 0 rgba(255,255,255,.02)',
                }}
            />
            {!active && (
                <label style={{
                    position: 'absolute', left: 0, right: 0, top: '50%',
                    transform: 'translateY(-50%)', textAlign: 'center',
                    color: '#475569', fontSize: '1rem', pointerEvents: 'none',
                }}>
                    Digite o valor
                </label>
            )}
        </div>
    )
}

/* ─── Tela de sucesso ────────────────────────────────────── */
function SuccessScreen({ amount, account, onBack }) {
    const confetti = Array.from({ length: 12 }, (_, i) => ({
        color: ['#22c55e', '#38bdf8', '#facc15', '#a78bfa'][i % 4],
        left: `${8 + i * 7}%`,
        delay: `${(i * 0.08).toFixed(2)}s`,
        dur: `${0.7 + Math.random() * 0.5}s`,
    }))

    return (
        <motion.div
            initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .4, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', padding: '12px 0', position: 'relative' }}
        >
            {/* Confetti */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, overflow: 'hidden', pointerEvents: 'none' }}>
                {confetti.map((c, i) => (
                    <div key={i} style={{
                        position: 'absolute', left: c.left, top: 0,
                        width: 8, height: 8, borderRadius: 2, background: c.color,
                        animation: `confetti-fall ${c.dur} ${c.delay} ease-out forwards`,
                    }} />
                ))}
            </div>

            {/* Ícone */}
            <div style={{
                width: 88, height: 88, borderRadius: '50%', margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 16px rgba(34,197,94,.1), 0 8px 32px rgba(34,197,94,.4)',
                animation: 'success-pop .5s ease-out',
            }}>
                <i className="pi pi-check" style={{ fontSize: '2.2rem', color: '#fff' }} />
            </div>

            <h2 style={{
                margin: '0 0 8px', fontSize: '1.6rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #22c55e, #38bdf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
                Depósito realizado!
            </h2>
            <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '.9rem' }}>
                Sua conta foi creditada com sucesso
            </p>

            {/* Resumo */}
            <div style={{
                background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)',
                borderRadius: 16, padding: '20px 24px', marginBottom: 28, textAlign: 'left',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>Valor depositado</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22c55e' }}>{formatBRL(amount)}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '.8rem', color: '#64748b' }}>Conta</span>
                    <span style={{ fontSize: '.85rem', color: '#94a3b8', fontFamily: 'monospace' }}>#{account}</span>
                </div>
            </div>

            <motion.button
                whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: .97 }}
                onClick={onBack}
                style={{
                    width: '100%', padding: '14px', border: 'none', borderRadius: 14,
                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                    color: '#fff', fontWeight: 800, fontSize: '.95rem', cursor: 'pointer',
                    boxShadow: '0 6px 24px rgba(34,197,94,.35)', position: 'relative', overflow: 'hidden',
                }}
            >
                <span style={{
                    position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent)',
                    transform: 'skewX(-20deg)', animation: 'shine 3s infinite',
                }} />
                <i className="pi pi-home" style={{ marginRight: 8 }} />
                Voltar ao dashboard
            </motion.button>
        </motion.div>
    )
}

/* ─── Deposit ────────────────────────────────────────────── */
export default function Deposit() {
    const navigate = useNavigate()
    const cardRef = useRef(null)

    const [accounts, setAccounts] = useState([])
    const [selectedAccount, setSelectedAccount] = useState('')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetchingAccounts, setFetchingAccounts] = useState(true)
    const [success, setSuccess] = useState(false)
    const [successData, setSuccessData] = useState(null)

    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const [spot, setSpot] = useState({ x: 50, y: 50 })

    const user = getUserFromToken()

    useEffect(() => {
        if (!user?.email) { navigate('/login'); return }

        api.get('/accounts')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : res.data.accounts || []
                const filtered = list.filter(a => a.email === user.email)
                setAccounts(filtered)
                if (filtered.length === 1) setSelectedAccount(filtered[0].accountNumber)
            })
            .catch(() => toast.error('Erro ao carregar contas', toastStyle(false)))
            .finally(() => setFetchingAccounts(false))
    }, [])

    function onMouseMove(e) {
        const r = cardRef.current?.getBoundingClientRect()
        if (!r) return
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        setTilt({ x: (y - .5) * 7, y: (x - .5) * -7 })
        setSpot({ x: x * 100, y: y * 100 })
    }

    function handleAmountChange(e) {
        const raw = e.target.value.replace(/[^\d,\.]/g, '').replace(',', '.')
        if (/^\d*\.?\d{0,2}$/.test(raw)) setAmount(raw)
    }

    function applyQuick(val) {
        setAmount(String(val))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const parsed = parseFloat(amount.replace(',', '.'))

        if (!selectedAccount) return toast.error('Selecione uma conta', toastStyle(false))
        if (!parsed || parsed <= 0) return toast.error('Digite um valor válido', toastStyle(false))
        if (parsed > 50000) return toast.error('Limite máximo por depósito: R$ 50.000', toastStyle(false))

        setLoading(true)
        try {
            await api.post('/deposit', {
                accountNumber: selectedAccount,
                amount: parsed,
                description: description || 'Depósito',
            })
            setSuccessData({ amount: parsed, account: selectedAccount })
            setSuccess(true)
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Erro ao realizar depósito', toastStyle(false))
        } finally {
            setLoading(false)
        }
    }

    const selectedAcc = accounts.find(a => a.accountNumber === selectedAccount)

    const blobs = [
        { w: 460, h: 460, top: '-12%', left: '-8%', color: 'rgba(34,197,94,.12)', dur: '10s' },
        { w: 360, h: 360, bottom: '5%', right: '-6%', color: 'rgba(37,99,235,.12)', dur: '13s' },
        { w: 280, h: 280, top: '45%', left: '38%', color: 'rgba(250,204,21,.08)', dur: '16s' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
            <style>{DEPOSIT_CSS}</style>
            <Toaster position="top-center" />

            {/* Blobs */}
            {blobs.map((b, i) => (
                <div key={i} style={{
                    position: 'fixed', width: b.w, height: b.h,
                    top: b.top, left: b.left, right: b.right, bottom: b.bottom,
                    borderRadius: '50%', background: b.color, filter: 'blur(80px)',
                    animation: `blob-move ${b.dur} ease-in-out infinite`,
                    pointerEvents: 'none', zIndex: 0,
                }} />
            ))}

            {/* Card */}
            <motion.div
                ref={cardRef}
                onMouseMove={onMouseMove}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                initial={{ opacity: 0, y: 40, scale: .94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    width: '100%', maxWidth: 460, position: 'relative', zIndex: 1,
                    background: 'rgba(15,23,42,.78)', backdropFilter: 'blur(28px)',
                    border: '1px solid rgba(255,255,255,.08)', borderRadius: 28,
                    padding: '42px 38px',
                    boxShadow: '0 0 0 1px rgba(255,255,255,.03), 0 24px 64px rgba(0,0,0,.55), 0 0 80px rgba(34,197,94,.06)',
                    transformStyle: 'preserve-3d',
                    transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: 'transform .12s ease',
                }}
            >
                {/* Spotlight */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: 28, pointerEvents: 'none',
                    background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(34,197,94,.08) 0%, transparent 60%)`,
                }} />

                {/* Borda glow top */}
                <div style={{
                    position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(34,197,94,.45), transparent)',
                }} />

                <AnimatePresence mode="wait">
                    {success ? (
                        <SuccessScreen
                            key="success"
                            amount={successData.amount}
                            account={successData.account}
                            onBack={() => navigate('/')}
                        />
                    ) : (
                        <motion.div key="form" exit={{ opacity: 0, scale: .95 }} transition={{ duration: .2 }}>
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}
                            >
                                <div style={{
                                    width: 66, height: 66, borderRadius: 20,
                                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 14, boxShadow: '0 10px 32px rgba(34,197,94,.4)',
                                    animation: 'float-logo 3s ease-in-out infinite',
                                }}>
                                    <i className="pi pi-plus-circle" style={{ fontSize: '1.8rem', color: '#fff' }} />
                                </div>
                                <h1 style={{
                                    margin: 0, fontSize: '2rem', fontWeight: 800, letterSpacing: '-.04em',
                                    background: 'linear-gradient(135deg, #e2e8f0, #22c55e 50%, #38bdf8)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>
                                    Depositar
                                </h1>
                                <p style={{ marginTop: 6, color: '#64748b', fontSize: '.88rem' }}>
                                    Adicione saldo à sua conta 💰
                                </p>
                            </motion.div>

                            <div style={{ borderBottom: '1px solid rgba(255,255,255,.06)', marginBottom: 26 }} />

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {/* Seleção de conta */}
                                {accounts.length > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .16 }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                                    >
                                        <label style={{ fontSize: '.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                                            Conta de destino
                                        </label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {accounts.map(acc => (
                                                <button
                                                    key={acc.accountNumber} type="button"
                                                    onClick={() => setSelectedAccount(acc.accountNumber)}
                                                    style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                                                        background: selectedAccount === acc.accountNumber ? 'rgba(34,197,94,.1)' : 'rgba(255,255,255,.04)',
                                                        border: `1px solid ${selectedAccount === acc.accountNumber ? 'rgba(34,197,94,.35)' : 'rgba(255,255,255,.08)'}`,
                                                        transition: '.2s',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{
                                                            width: 32, height: 32, borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #2563eb, #facc15)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '.85rem', fontWeight: 800, color: '#020617',
                                                        }}>
                                                            {acc.fullName?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div style={{ textAlign: 'left' }}>
                                                            <p style={{ margin: 0, fontSize: '.88rem', color: '#e2e8f0', fontWeight: 600 }}>{acc.fullName}</p>
                                                            <p style={{ margin: 0, fontSize: '.75rem', color: '#475569', fontFamily: 'monospace' }}>#{acc.accountNumber}</p>
                                                        </div>
                                                    </div>
                                                    <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#22c55e' }}>
                                                        {formatBRL(acc.balance)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Conta única — info */}
                                {accounts.length === 1 && selectedAcc && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .16 }}
                                        style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                                            borderRadius: 14, padding: '14px 16px',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #2563eb, #facc15)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '.9rem', fontWeight: 800, color: '#020617',
                                            }}>
                                                {selectedAcc.fullName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '.88rem', color: '#e2e8f0', fontWeight: 600 }}>{selectedAcc.fullName}</p>
                                                <p style={{ margin: 0, fontSize: '.75rem', color: '#475569', fontFamily: 'monospace' }}>#{selectedAcc.accountNumber}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '.72rem', color: '#475569' }}>Saldo atual</p>
                                            <p style={{ margin: 0, fontSize: '.9rem', fontWeight: 700, color: '#22c55e' }}>{formatBRL(selectedAcc.balance)}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Input de valor */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .22 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                                >
                                    <label style={{ fontSize: '.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                                        Valor do depósito
                                    </label>
                                    <AmountInput value={amount} onChange={handleAmountChange} />

                                    {/* Atalhos */}
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {QUICK_VALUES.map(v => (
                                            <button
                                                key={v} type="button" onClick={() => applyQuick(v)}
                                                style={{
                                                    flex: 1, minWidth: 60, padding: '7px 4px', borderRadius: 10,
                                                    background: amount === String(v) ? 'rgba(34,197,94,.18)' : 'rgba(255,255,255,.05)',
                                                    border: `1px solid ${amount === String(v) ? 'rgba(34,197,94,.4)' : 'rgba(255,255,255,.08)'}`,
                                                    color: amount === String(v) ? '#22c55e' : '#64748b',
                                                    fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', transition: '.2s',
                                                }}
                                                onMouseEnter={e => { if (amount !== String(v)) { e.currentTarget.style.background = 'rgba(255,255,255,.09)'; e.currentTarget.style.color = '#94a3b8' } }}
                                                onMouseLeave={e => { if (amount !== String(v)) { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = '#64748b' } }}
                                            >
                                                R$ {v}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Descrição */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .28 }}
                                >
                                    <FloatInput
                                        label="Descrição (opcional)"
                                        icon="pi-tag"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </motion.div>

                                {/* Preview */}
                                {amount && parseFloat(amount) > 0 && selectedAcc && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                        style={{
                                            background: 'rgba(34,197,94,.07)', border: '1px solid rgba(34,197,94,.18)',
                                            borderRadius: 14, padding: '14px 16px',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        }}
                                    >
                                        <div>
                                            <p style={{ margin: 0, fontSize: '.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
                                                Saldo após depósito
                                            </p>
                                            <p style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#22c55e' }}>
                                                {formatBRL(Number(selectedAcc.balance) + parseFloat(amount))}
                                            </p>
                                        </div>
                                        <i className="pi pi-arrow-up-right" style={{ fontSize: '1.4rem', color: 'rgba(34,197,94,.5)' }} />
                                    </motion.div>
                                )}

                                {/* Botão */}
                                <motion.button
                                    whileHover={!loading ? { y: -3, scale: 1.02 } : {}}
                                    whileTap={!loading ? { scale: .97 } : {}}
                                    type="submit"
                                    disabled={loading || fetchingAccounts}
                                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .34 }}
                                    style={{
                                        width: '100%', marginTop: 4, padding: '15px 20px',
                                        border: 'none', borderRadius: 14,
                                        background: loading
                                            ? 'rgba(34,197,94,.35)'
                                            : 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #38bdf8 100%)',
                                        color: '#fff', fontWeight: 800, fontSize: '.95rem',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 10px 32px rgba(34,197,94,.3)',
                                        position: 'relative', overflow: 'hidden',
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent)',
                                        transform: 'skewX(-20deg)', animation: 'shine 2.8s infinite',
                                    }} />
                                    {loading
                                        ? <><i className="pi pi-spin pi-spinner" style={{ marginRight: 8 }} />Processando...</>
                                        : <><i className="pi pi-check" style={{ marginRight: 8 }} />Confirmar depósito</>
                                    }
                                </motion.button>

                                {/* Voltar */}
                                <button
                                    type="button" onClick={() => navigate(-1)}
                                    style={{
                                        width: '100%', padding: '11px', border: '1px solid rgba(255,255,255,.08)',
                                        borderRadius: 14, background: 'transparent', color: '#475569',
                                        fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', transition: '.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.color = '#94a3b8' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
                                >
                                    <i className="pi pi-arrow-left" style={{ marginRight: 6 }} />
                                    Voltar
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}