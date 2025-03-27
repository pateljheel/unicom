import React from 'react';
import { Link } from 'react-router-dom';
import './CStyles.css';
import { logout } from '../utils/Auth';

function Header() {
  return (
    <header className="header">
      <div className="site-name">UniCom</div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Feed</Link>
        <Link to="/myposts" className="nav-link">MyPosts</Link>
        <button className="logout-button" onClick={logout}>Logout</button>
      </nav>
    </header>
  );
}

export default Header;
