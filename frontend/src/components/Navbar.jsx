import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
  SenaiBank
</Link>
      <button onClick={handleLogout}>Sair</button>
    </nav>
  )
}