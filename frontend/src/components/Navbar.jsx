import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">MyTurn</Link>
      <div className="navbar-links">
        <Link to="/info" className="navbar-link">Info</Link>
        <Link to="/overview" className="navbar-link">Overview</Link>
        <Link to="/Result" className="navbar-link">Results</Link>
      </div>
    </nav>
  );
}