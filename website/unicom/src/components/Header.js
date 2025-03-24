import React from 'react';
import { Link } from 'react-router-dom';
import './CStyles.css';

function Header() {
  return (
    <header className="header">
      <div className="site-name">UniCom</div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Feed</Link>
        <Link to="/myposts" className="nav-link">MyPosts</Link>
      </nav>
    </header>
  );
}

export default Header;
