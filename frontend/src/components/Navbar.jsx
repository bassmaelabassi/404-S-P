import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me/session')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    api.post('/auth/logout')
      .then(() => {
        setUser(null);
        navigate('/login');
      })
      .catch(err => console.error(err));
  };

  return (
    <nav className="bg-gray-800 p-7 flex justify-between items-center">
      <h1 className="text-amber-500 text-xl font-bold">AuthApp</h1>
      <div className="flex space-x-4">
        <Link to="/">
          <button className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600">Home</button>
        </Link>

        {user ? (
          <>
            <Link to="/profile">
              <button className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600">Profil</button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600">Login</button>
            </Link>
            <Link to="/register">
              <button className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;