import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header__left">
        <Link to="/applications" className="brand">
          Job Application Tracker
        </Link>
      </div>
      {user ? (
        <div className="header__right">
          <span className="user-email">{user.email}</span>
          <button type="button" className="secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : null}
    </header>
  )
}

export default Header

