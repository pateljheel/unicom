// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Feed from './pages/Feed';
import MyPosts from './pages/MyPosts';
import AuthGuard from './utils/AuthWrapper';
import './App.css';

function App() {
  return (
    <Router>
      <AuthGuard>
        <div className="app-container">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/myposts" element={<MyPosts />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthGuard>
    </Router>
  );
}

export default App;
