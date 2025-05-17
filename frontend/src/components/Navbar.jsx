import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white p-4 shadow-md flex justify-between items-center">
      <Link to="/" className="font-bold text-xl text-blue-600">
        404-S-P
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              Profile
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;