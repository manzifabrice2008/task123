import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4 py-2">
      <div className="d-flex align-items-center">
        <h5 className="mb-0">Sales Record Management System</h5>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center text-secondary">
          <span className="me-1">&#128100;</span>
          <span>{user?.username}</span>
        </div>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
