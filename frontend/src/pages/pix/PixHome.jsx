import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PixHome() {
  return (
    <div className="fade-in">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ maxWidth: 900, margin: '0 auto' }}
      >
        <h2 style={{ marginBottom: 24 }}>Área PIX</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24
          }}
        >
          <Link to="/pix/send" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="card"
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>💸</div>
              <h3>Enviar PIX</h3>
              <p style={{ fontSize: 14 }}>
                Transferir dinheiro de forma instantânea
              </p>
            </motion.div>
          </Link>

          <Link to="/pix/receive" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="card"
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📥</div>
              <h3>Receber / Cobrar</h3>
              <p style={{ fontSize: 14 }}>
                Gere cobranças e receba por PIX
              </p>
            </motion.div>
          </Link>

          <Link to="/pix/approx" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="card"
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
              <h3>PIX por aproximação</h3>
              <p style={{ fontSize: 14 }}>
                Pague aproximando o celular
              </p>
            </motion.div>
          </Link>

          <Link to="/pix/history" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="card"
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📜</div>
              <h3>Histórico</h3>
              <p style={{ fontSize: 14 }}>
                Veja todas as transações PIX
              </p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}