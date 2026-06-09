import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <div className="text-danger mb-3" style={{ fontSize: '5rem', fontWeight: 'bold' }}>!</div>
      <h1 className="display-4 fw-bold">404</h1>
      <p className="text-muted mb-4">Page not found</p>
      <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
    </div>
  );
}
