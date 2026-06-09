import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Items', path: '/items' },
  { label: 'Sales', path: '/sales' },
  { label: 'Reports', path: '/reports/daily' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();

  return (
    <div
      className="bg-dark text-white d-flex flex-column"
      style={{
        width: collapsed ? '70px' : '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        transition: 'width 0.3s',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
        {!collapsed && (
          <div>
            <h5 className="mb-0 fw-bold">DAB Enterprise</h5>
            <small className="text-secondary">SRMS</small>
          </div>
        )}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '>' : '<'}
        </button>
      </div>

      <nav className="flex-grow-1 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `d-flex align-items-center px-3 py-2 text-decoration-none ${
                isActive ? 'bg-primary text-white' : 'text-white-50'
              }`
            }
            style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            <span className="fw-bold me-2" style={{ width: 20, textAlign: 'center' }}>
              {item.label === 'Dashboard' && 'D'}
              {item.label === 'Items' && 'I'}
              {item.label === 'Sales' && 'S'}
              {item.label === 'Reports' && 'R'}
            </span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-top border-secondary">
        {!collapsed && (
          <small className="text-secondary">
            Logged in as <strong>{user?.username}</strong>
          </small>
        )}
      </div>
    </div>
  );
}
