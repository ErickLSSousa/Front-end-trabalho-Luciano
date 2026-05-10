import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { InputMask } from "primereact/inputmask";
import { InputText } from 'primereact/inputtext';
import toast, { Toaster } from 'react-hot-toast'
import authService from '../services/authService'

const GLOBAL_CSS = `
  @keyframes blob-move {
    0%,100% { transform: translate(0,0) scale(1); }
    33% { transform: translate(40px,-30px) scale(1.08); }
    66% { transform: translate(-25px,20px) scale(0.94); }
  }

  @keyframes float-logo {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  @keyframes shine {
    0% { left: -100%; opacity: 0; }
    20% { opacity: .5; }
    100% { left: 200%; opacity: 0; }
  }

  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,.12);
    border-radius: 999px;
  }
`

function toastStyle(success = true) {
  return {
    style: {
      background: 'rgba(15,23,42,.92)',
      backdropFilter: 'blur(18px)',
      color: '#e2e8f0',
      border: `1px solid ${success ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`,
      borderRadius: '14px',
      fontSize: '.85rem',
    }
  }
}

function FloatInput({ label, icon, value, onChange, name, type = 'text' }) {
  const [focused, setFocused] = useState(false)

  const active = focused || value.length > 0

  return (
    <div style={{ position: 'relative' }}>
      <i
        className={`pi ${icon}`}
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: focused ? '#38bdf8' : '#475569',
          zIndex: 2,
          transition: '.2s',
          fontSize: '.9rem'
        }}
      />

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: focused
            ? 'rgba(37,99,235,.08)'
            : 'rgba(255,255,255,.04)',
          border: `1px solid ${focused ? '#2563eb' : 'rgba(255,255,255,.08)'}`,
          borderRadius: 14,
          color: '#e2e8f0',
          fontSize: '.92rem',
          paddingTop: active ? 22 : 15,
          paddingBottom: active ? 8 : 15,
          paddingLeft: 42,
          paddingRight: 14,
          outline: 'none',
          transition: '.2s',
          boxShadow: focused
            ? '0 0 0 4px rgba(37,99,235,.12), 0 0 24px rgba(37,99,235,.12)'
            : 'inset 0 1px 0 rgba(255,255,255,.02)',
        }}
      />

      <label
        style={{
          position: 'absolute',
          left: 42,
          top: active ? 8 : '50%',
          transform: active ? 'none' : 'translateY(-50%)',
          fontSize: active ? '.64rem' : '.88rem',
          color: focused ? '#38bdf8' : '#64748b',
          textTransform: active ? 'uppercase' : 'none',
          letterSpacing: active ? '.08em' : '0',
          fontWeight: active ? 700 : 400,
          transition: '.2s',
          pointerEvents: 'none'
        }}
      >
        {label}
      </label>
    </div>
  )
}

function FloatPassword({ label, value, onChange }) {
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)

  const active = focused || value.length > 0

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: focused
            ? 'rgba(37,99,235,.08)'
            : 'rgba(255,255,255,.04)',
          border: `1px solid ${focused ? '#2563eb' : 'rgba(255,255,255,.08)'}`,
          borderRadius: 14,
          color: '#e2e8f0',
          fontSize: '.92rem',
          paddingTop: active ? 22 : 15,
          paddingBottom: active ? 8 : 15,
          paddingLeft: 14,
          paddingRight: 48,
          outline: 'none',
          transition: '.2s',
          boxShadow: focused
            ? '0 0 0 4px rgba(37,99,235,.12), 0 0 24px rgba(37,99,235,.12)'
            : 'inset 0 1px 0 rgba(255,255,255,.02)',
        }}
      />

      <label
        style={{
          position: 'absolute',
          left: 14,
          top: active ? 8 : '50%',
          transform: active ? 'none' : 'translateY(-50%)',
          fontSize: active ? '.64rem' : '.88rem',
          color: focused ? '#38bdf8' : '#64748b',
          textTransform: active ? 'uppercase' : 'none',
          letterSpacing: active ? '.08em' : '0',
          fontWeight: active ? 700 : 400,
          transition: '.2s',
          pointerEvents: 'none'
        }}
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: 'absolute',
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer'
        }}
      >
        <i className={`pi ${show ? 'pi-eye-slash' : 'pi-eye'}`} />
      </button>
    </div>
  )
}

function PasswordStrength({ password }) {
  let strength = 0

  if (password.length >= 6) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  const labels = ['Muito fraca', 'Fraca', 'Média', 'Boa', 'Forte']
  const widths = ['8%', '30%', '55%', '78%', '100%']
  const colors = ['#ef4444', '#f97316', '#eab308', '#38bdf8', '#22c55e']

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          width: '100%',
          height: 6,
          background: 'rgba(255,255,255,.06)',
          borderRadius: 999,
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={false}
          animate={{ width: widths[strength] }}
          transition={{ duration: .25 }}
          style={{
            height: '100%',
            borderRadius: 999,
            background: colors[strength]
          }}
        />
      </div>

      <span
        style={{
          fontSize: '.72rem',
          color: colors[strength],
          marginTop: 6,
          display: 'inline-block',
          fontWeight: 600
        }}
      >
        {labels[strength]}
      </span>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const [spot, setSpot] = useState({ x: 50, y: 50 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const [form, setForm] = useState({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  function handlePassword(field) {
    return e => {
      setForm(prev => ({
        ...prev,
        [field]: e.target.value
      }))
    }
  }

  function handleMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect()

    if (!rect) return

    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setSpot({ x: x * 100, y: y * 100 })

    setTilt({
      x: (y - .5) * 8,
      y: (x - .5) * -8
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      return toast.error('As senhas não coincidem', toastStyle(false))
    }

    setLoading(true)

    try {
      await authService.register({
        fullName: form.fullName,
        cpf: form.cpf,
        email: form.email,
        phone: form.phone,
        password: form.password
      })

      toast.success('Conta criada com sucesso 🚀', toastStyle(true))

      setTimeout(() => {
        navigate('/login')
      }, 1200)

    } catch (err) {
      toast.error(
        err?.response?.data?.error || 'Erro ao criar conta',
        toastStyle(false)
      )
    } finally {
      setLoading(false)
    }
  }

  const blobs = [
    {
      width: 420,
      height: 420,
      top: '-10%',
      left: '-8%',
      color: 'rgba(37,99,235,.18)',
      duration: '10s'
    },
    {
      width: 320,
      height: 320,
      bottom: '8%',
      right: '-6%',
      color: 'rgba(250,204,21,.12)',
      duration: '13s'
    },
    {
      width: 260,
      height: 260,
      bottom: '15%',
      left: '30%',
      color: 'rgba(56,189,248,.10)',
      duration: '15s'
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        overflow: 'hidden',
        position: 'relative',
        background: '#020617'
      }}
    >
      <style>{GLOBAL_CSS}</style>

      <Toaster position="top-center" />

      {blobs.map((blob, index) => (
        <div
          key={index}
          style={{
            position: 'fixed',
            width: blob.width,
            height: blob.height,
            top: blob.top,
            left: blob.left,
            right: blob.right,
            bottom: blob.bottom,
            borderRadius: '50%',
            background: blob.color,
            filter: 'blur(72px)',
            animation: `blob-move ${blob.duration} ease-in-out infinite`,
            pointerEvents: 'none'
          }}
        />
      ))}

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        initial={{ opacity: 0, y: 40, scale: .94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .5 }}
        style={{
          width: '100%',
          maxWidth: 560,
          position: 'relative',
          zIndex: 2,
          background: 'rgba(15,23,42,.78)',
          backdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 28,
          padding: '42px 38px',
          boxShadow: '0 24px 64px rgba(0,0,0,.55)',
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform .12s ease'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(250,204,21,.08) 0%, transparent 60%)`
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 30
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #2563eb, #facc15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              boxShadow: '0 10px 32px rgba(37,99,235,.45)',
              animation: 'float-logo 3s ease-in-out infinite'
            }}
          >
            <i
              className="pi pi-user-plus"
              style={{
                fontSize: '1.7rem',
                color: '#020617'
              }}
            />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '2.1rem',
              fontWeight: 800,
              letterSpacing: '-.04em',
              background: 'linear-gradient(135deg, #e2e8f0, #38bdf8 45%, #facc15)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Criar conta
          </h1>

          <p
            style={{
              marginTop: 8,
              color: '#64748b',
              fontSize: '.9rem'
            }}
          >
            Crie sua conta no SenaiBank ✨
          </p>
        </motion.div>

        <div
          style={{
            borderBottom: '1px solid rgba(255,255,255,.06)',
            marginBottom: 26
          }}
        />

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: .16 }}
          >
            <FloatInput
              label="Nome completo"
              icon="pi-user"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .22 }}
            >
              <InputMask
                mask="999.999.999-99"
                placeholder="CPF"
                value={form.cpf}
                onChange={e => setForm(prev => ({ ...prev, cpf: e.target.value }))}
              />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: .28 }}
          >
            <InputMask
              id="phone"
              mask="(99) 99999-9999"
              placeholder="Telefone"
              value={form.phone}
              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value}))}
            >
            </InputMask>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .34 }}
        >
          <InputText
            placeholder='E-mail'
            keyfilter="email"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value}))}
          />
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: .40 }}
          >
            <FloatPassword
              label="Senha"
              value={form.password}
              onChange={handlePassword('password')}
            />

            <PasswordStrength password={form.password} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: .46 }}
          >
            <FloatPassword
              label="Confirmar senha"
              value={form.confirmPassword}
              onChange={handlePassword('confirmPassword')}
            />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: .98 }}
          disabled={loading}
          type="submit"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .52 }}
          style={{
            width: '100%',
            marginTop: 8,
            border: 'none',
            borderRadius: 14,
            padding: '15px 20px',
            position: 'relative',
            overflow: 'hidden',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? 'rgba(37,99,235,.4)'
              : 'linear-gradient(135deg, #2563eb 0%, #38bdf8 45%, #facc15 100%)',
            color: '#020617',
            fontWeight: 800,
            fontSize: '.95rem',
            boxShadow: '0 10px 32px rgba(37,99,235,.35)'
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)',
              transform: 'skewX(-20deg)',
              animation: 'shine 2.8s infinite'
            }}
          />

          {loading ? (
            <>
              <i className="pi pi-spin pi-spinner" style={{ marginRight: 8 }} />
              Criando conta...
            </>
          ) : (
            <>
              <i className="pi pi-check" style={{ marginRight: 8 }} />
              Criar conta
            </>
          )}
        </motion.button>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .6 }}
        style={{
          marginTop: 22,
          textAlign: 'center',
          color: '#64748b',
          fontSize: '.85rem'
        }}
      >
        Já possui conta?{' '}

        <Link
          to="/login"
          style={{
            color: '#facc15',
            textDecoration: 'none',
            fontWeight: 700
          }}
        >
          Entrar agora →
        </Link>
      </motion.p>
    </motion.div>
    </div >
  )
}
