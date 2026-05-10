import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AccountDetails from './pages/AccountDetails'
import Transfer from './pages/Transfer'
import Deposit from './pages/Deposit'

import PixHome from './pages/pix/PixHome'
import PixSend from './pages/pix/PixSend'
import PixReceive from './pages/pix/PixReceive'
import PixApproximation from './pages/pix/PixApproximation'
import PixHistory from './pages/pix/PixHistory'

import ProtectedRoute from './components/ProtectedRoute'
import BackgroundEffects from './components/BackgroundEffects'

function AppLayout({ children }) {
  return (
    <div className="app-root">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="app-container"
      >
        {children}
      </motion.main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <BackgroundEffects />

      <AnimatePresence mode="wait">
        <AppLayout>
          <Routes>
            <Route
              path="/login"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <Login />
                </motion.div>
              }
            />

            <Route
              path="/register"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <Register />
                </motion.div>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/:accountNumber"
              element={
                <ProtectedRoute>
                  <AccountDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transfer"
              element={
                <ProtectedRoute>
                  <Transfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deposit"
              element={
                <ProtectedRoute>
                  <Deposit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pix"
              element={
                <ProtectedRoute>
                  <PixHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pix/send"
              element={
                <ProtectedRoute>
                  <PixSend />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pix/receive"
              element={
                <ProtectedRoute>
                  <PixReceive />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pix/approx"
              element={
                <ProtectedRoute>
                  <PixApproximation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pix/history"
              element={
                <ProtectedRoute>
                  <PixHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppLayout>
      </AnimatePresence>
    </>
  )
}