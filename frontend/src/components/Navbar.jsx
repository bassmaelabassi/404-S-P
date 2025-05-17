import { Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

const Navbar = () => {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return <div className="bg-gray-800 text-white p-4">Loading...</div>
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Auth App</Link>
        
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin/users" className="hover:text-gray-300">Admin</Link>
              )}
              <button onClick={logout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar