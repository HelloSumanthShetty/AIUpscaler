import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HeroShowcase from './components/HeroShowcase';
import About from './components/About';
import History from './components/History';
import Login from './components/Login';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <>
                <Hero />
                <History />
                <HeroShowcase />
                <About />
                <Footer />
              </>
            }
          />
        </Routes>
        <Toaster
          position="top-center"
          offset="80px"
          toastOptions={{
            style: {
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)'
            }
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
