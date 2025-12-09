import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ApplicationsList from './pages/ApplicationsList'
import ApplicationForm from './pages/ApplicationForm'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header'

function RequireAuth({ children }) {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <div className="page">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

function RedirectIfAuthed({ children }) {
  const { isAuthenticated, initializing } = useAuth()

  if (initializing) {
    return <div className="page">Loading...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/applications" replace />
  }

  return children
}

function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace />} />
      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <Login />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuthed>
            <Register />
          </RedirectIfAuthed>
        }
      />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/applications" element={<ApplicationsList />} />
        <Route path="/applications/new" element={<ApplicationForm />} />
        <Route path="/applications/:id/edit" element={<ApplicationForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/applications" replace />} />
    </Routes>
  )
}

export default App
